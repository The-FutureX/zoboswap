const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Exchange", () => {
  let token1, token2, accounts, deployer, feeAccount, exchange, user1, user2;
  const feePercent = 10;

  beforeEach(async () => {
    const Exchange = await ethers.getContractFactory("Exchange");
    const Token = await ethers.getContractFactory("Token");

    token1 = await Token.deploy("ZoboCoin", "zBC", 1000000);
    token2 = await Token.deploy("SuCoin", "sCN", 1000000);

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    feeAccount = accounts[1];
    user1 = accounts[2];
    user2 = accounts[3];

    let transaction = await token1
      .connect(deployer)
      .transfer(user1.address, tokens(100));
    await transaction.wait();

    exchange = await Exchange.deploy(feeAccount.address, feePercent);
  });

  describe("Deployment", () => {
    it("tracks the fee account", async () => {
      expect(await exchange.feeAccount()).to.equal(feeAccount.address);
    });
    it("tracks the fee percent", async () => {
      expect(await exchange.feePercent()).to.equal(feePercent);
    });
  });

  describe("Depositing Tokens", () => {
    let transaction, result;
    let amount = tokens(10);

    describe("Success", () => {
      beforeEach(async () => {
        transaction = await token1
          .connect(user1)
          .approve(exchange.address, amount);

        transaction = await exchange
          .connect(user1)
          .depositToken(token1.address, amount);
        result = await transaction.wait();
      });
      it("tracks the token deposit", async () => {
        expect(await token1.balanceOf(exchange.address)).to.equal(amount);
        expect(await exchange.tokens(token1.address, user1.address)).to.equal(
          amount
        );
        expect(
          await exchange.balanceOf(token1.address, user1.address)
        ).to.equal(amount);
      });

      it("emits a Deposit event", async () => {
        const event = result.events[1];
        expect(event.event).to.equal("Deposit");

        const args = event.args;
        expect(args.token).to.equal(token1.address);
        expect(args.user).to.equal(user1.address);
        expect(args.amount).to.equal(amount);
        expect(args.balance).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("fails when no tokens are approved", async () => {
        await expect(
          exchange.connect(user1).depositToken(token1.address, amount)
        ).to.be.reverted;
      });
    });
  });

  describe("Withdrawing Tokens", () => {
    let transaction, result;
    let amount = tokens(10);

    describe("Success", () => {
      beforeEach(async () => {
        // Approve Tokens
        transaction = await token1
          .connect(user1)
          .approve(exchange.address, amount);

        // Deposit Token
        transaction = await exchange
          .connect(user1)
          .depositToken(token1.address, amount);
        result = await transaction.wait();

        // Withdraw token
        transaction = await exchange
          .connect(user1)
          .withdrawToken(token1.address, amount);

        result = await transaction.wait();
      });
      it("withdraws token funds", async () => {
        expect(await token1.balanceOf(exchange.address)).to.equal(0);
        expect(await exchange.tokens(token1.address, user1.address)).to.equal(
          0
        );
        expect(
          await exchange.balanceOf(token1.address, user1.address)
        ).to.equal(0);
      });

      it("emits a Withdraw event", async () => {
        const event = result.events[1];
        expect(event.event).to.equal("Withdraw");

        const args = event.args;
        expect(args.token).to.equal(token1.address);
        expect(args.user).to.equal(user1.address);
        expect(args.amount).to.equal(amount);
        expect(args.balance).to.equal(0);
      });
    });

    describe("Failure", () => {
      it("fails for insufficient balance", async () => {
        // Attepmt to withdrawToken without depositing
        await expect(
          exchange.connect(user1).withdrawToken(token1.address, amount)
        ).to.be.reverted;
      });
    });
  });

  describe("Checking Balances", () => {
    let transaction, result;
    let amount = tokens(1);

    beforeEach(async () => {
      transaction = await token1
        .connect(user1)
        .approve(exchange.address, amount);

      transaction = await exchange
        .connect(user1)
        .depositToken(token1.address, amount);
      result = await transaction.wait();
    });
    it("returns user balance", async () => {
      expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(
        amount
      );
    });
  });

  describe("Making orders", () => {
    let transaction, result;
    let amount = tokens(1);
    describe("Success", () => {
      beforeEach(async () => {
        transaction = await token1
          .connect(user1)
          .approve(exchange.address, amount);
        transaction = await exchange
          .connect(user1)
          .depositToken(token1.address, amount);

        transaction = await exchange
          .connect(user1)
          .makeOrder(token2.address, amount, token1.address, amount);
        result = await transaction.wait();
      });

      it("tracks the newly create order", async () => {
        expect(await exchange.orderCount()).to.equal(1);
      });
      it("emits an Order event", async () => {
        const event = result.events[0];
        const args = event.args;

        expect(event.event).to.equal("Order");

        expect(args.id).to.equal(1);
        expect(args.user).to.equal(user1.address);
        expect(args.tokenGet).to.equal(token2.address);
        expect(args.amountGet).to.equal(amount);
        expect(args.tokenGive).to.equal(token1.address);
        expect(args.amountGive).to.equal(amount);
        expect(args.timestamp).to.at.least(1);
      });
    });

    describe("Failure", () => {
      it("rejects with no balance", async () => {
        await expect(
          exchange
            .connect(user1)
            .makeOrder(token2.address, amount, token1.address, amount)
        ).to.be.reverted;
      });
    });
  });

  describe("Order actions", () => {
    let transaction, result;
    let amount = tokens(1);
    beforeEach(async () => {
      // user1 deposit tokens
      transaction = await token1
        .connect(user1)
        .approve(exchange.address, amount);

      transaction = await exchange
        .connect(user1)
        .depositToken(token1.address, amount);

      // Give tokens to user2
      transaction = await token2
        .connect(deployer)
        .transfer(user2.address, tokens(100));

      // user2 deposits tokens
      transaction = await token2
        .connect(user2)
        .approve(exchange.address, tokens(2));

      transaction = await exchange
        .connect(user2)
        .depositToken(token2.address, tokens(2));

      //  Make an Order
      transaction = await exchange
        .connect(user1)
        .makeOrder(token2.address, amount, token1.address, amount);
      result = await transaction.wait();
    });

    describe("Cancelling orders", async () => {
      describe("Success", () => {
        beforeEach(async () => {
          transaction = await exchange.connect(user1).cancelOrder(1);
          result = await transaction.wait();
        });

        it("updates canceled orders", async () => {
          expect(await exchange.orderCancelled(1)).to.equal(true);
        });

        it("emits a Cancel event", async () => {
          const event = result.events[0];
          const args = event.args;

          expect(event.event).to.equal("Cancel");

          expect(args.id).to.equal(1);
          expect(args.user).to.equal(user1.address);
          expect(args.tokenGet).to.equal(token2.address);
          expect(args.amountGet).to.equal(amount);
          expect(args.tokenGive).to.equal(token1.address);
          expect(args.amountGive).to.equal(amount);
          expect(args.timestamp).to.at.least(1);
        });
      });

      describe("Failure", () => {
        const invalidId = 99999;
        it("rejects invalid order ids", async () => {
          await expect(exchange.connect(user1).cancelOrder(invalidId)).to.be
            .reverted;
        });
        it("rejects unauthorized cancellation", async () => {
          await expect(exchange.connect(user2).cancelOrder(1)).to.reverted;
        });
      });
    });

    describe("Filling Orders", () => {
      describe("Success", () => {
        beforeEach(async () => {
          transaction = await exchange.connect(user2).fillOrder("1");
          result = await transaction.wait();
        });

        it("Executes the trade and charge fees", async () => {
          // Token Give
          expect(
            await exchange.balanceOf(token1.address, user1.address)
          ).to.equal(tokens(0));

          expect(
            await exchange.balanceOf(token1.address, user2.address)
          ).to.equal(tokens(1));

          expect(
            await exchange.balanceOf(token1.address, feeAccount.address)
          ).to.equal(tokens(0));

          // Token Get
          expect(
            await exchange.balanceOf(token2.address, user1.address)
          ).to.equal(tokens(1));

          expect(
            await exchange.balanceOf(token2.address, user2.address)
          ).to.equal(tokens(0.9));

          expect(
            await exchange.balanceOf(token2.address, feeAccount.address)
          ).to.equal(tokens(0.1));
        });

        it("updates filled orders", async () => {
          expect(await exchange.orderFilled(1)).to.equal(true);
        });

        it("emits a Trade event", async () => {
          const event = result.events[0];
          const args = event.args;
          expect(event.event).to.equal("Trade");
          expect(args.id).to.equal(1);
          expect(args.user).to.equal(user2.address);
          expect(args.tokenGet).to.equal(token2.address);
          expect(args.amountGet).to.equal(tokens(1));
          expect(args.tokenGive).to.equal(token1.address);
          expect(args.amountGive).to.equal(tokens(1));
          expect(args.creator).to.equal(user1.address);
          expect(args.timestamp).to.at.least(1);
        });
      });

      describe("Failure", () => {
        it("rejects invalid order ids", async () => {
          const invalidOrderId = 9999;
          await expect(exchange.connect(user2).fillOrder(invalidOrderId)).to.be
            .reverted;
        });

        it("rejects already filled order", async () => {
          transaction = await exchange.connect(user2).fillOrder(1);
          await transaction.wait();

          await expect(exchange.connect(user2).fillOrder(1)).to.be.reverted;
        });

        it("rejects cancelled orders", async () => {
          transaction = await exchange.connect(user1).cancelOrder(1);
          await transaction.wait();

          await expect(exchange.connect(user2).fillOrder(1)).to.be.reverted;
        });
      });
    });
  });
});
