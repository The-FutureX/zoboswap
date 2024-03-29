const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokensToEther = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("ZoboToken", () => {
  let zoboToken, accounts, deployer, receiver, exchange;

  beforeEach(async () => {
    const ZoboToken = await ethers.getContractFactory("ZoboToken");
    zoboToken = await ZoboToken.deploy("ZoboToken", "ZBT", 18, "1000000");

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    receiver = accounts[1];
    exchange = accounts[2];
  });

  describe("Deployment", () => {
    const name = "ZoboToken";
    const symbol = "ZBT";
    const decimals = 18;
    const totalSupply = tokensToEther("1000000");

    it("has correct name", async () => {
      expect(await zoboToken.name()).to.equal(name);
    });

    it("has correct symbol", async () => {
      expect(await zoboToken.symbol()).to.equal(symbol);
    });

    it("has correct decimals", async () => {
      expect(await zoboToken.decimals()).to.equal(decimals);
    });

    it("has correct total supply", async () => {
      expect(await zoboToken.totalSupply()).to.equal(totalSupply);
    });

    it("assigns total supply to deployer", async () => {
      expect(await zoboToken.balanceOf(deployer.address)).to.equal(totalSupply);
    });
  });

  describe("Sending tokensToEther", () => {
    let amount, transaction, result;

    describe("Success", () => {
      beforeEach(async () => {
        amount = tokensToEther(100);
        transaction = await zoboToken
          .connect(deployer)
          .transfer(receiver.address, amount);
        result = await transaction.wait();
      });

      it("transfers zoboToken balances", async () => {
        expect(await zoboToken.balanceOf(deployer.address)).to.equal(
          tokensToEther(999900)
        );
        expect(await zoboToken.balanceOf(receiver.address)).to.equal(amount);
      });

      it("emits a Transfer event", async () => {
        const event = result.events[0];
        expect(event.event).to.equal("Transfer");

        const args = event.args;
        expect(args.from).to.equal(deployer.address);
        expect(args.to).to.equal(receiver.address);
        expect(args.value).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("rejects insufficient balances", async () => {
        const invalidAmount = tokensToEther(100000000);
        await expect(
          zoboToken.connect(deployer).transfer(receiver.address, invalidAmount)
        ).to.be.reverted;
      });

      it("rejects invalid recipent", async () => {
        const amount = tokensToEther(100);
        await expect(
          zoboToken
            .connect(deployer)
            .transfer("0x0000000000000000000000000000000000000000", amount)
        ).to.be.reverted;
      });
    });
  });

  describe("Approving Tokens", () => {
    let amount, transaction, result;

    beforeEach(async () => {
      amount = tokensToEther(100);
      transaction = await zoboToken
        .connect(deployer)
        .approve(exchange.address, amount);
      result = await transaction.wait();
    });

    describe("Success", () => {
      it("allocates an allowance for delegated zoboToken spending", async () => {
        expect(
          await zoboToken.allowance(deployer.address, exchange.address)
        ).to.equal(amount);
      });

      it("emits an Approval event", async () => {
        const event = result.events[0];
        expect(event.event).to.equal("Approval");

        const args = event.args;
        expect(args.owner).to.equal(deployer.address);
        expect(args.spender).to.equal(exchange.address);
        expect(args.value).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("rejects invalid spenders", async () => {
        await expect(
          zoboToken
            .connect(deployer)
            .approve("0x0000000000000000000000000000000000000000", amount)
        ).to.be.reverted;
      });
    });
  });

  describe("Delegated Token Transfers", () => {
    let amount, transaction, result;

    beforeEach(async () => {
      amount = tokensToEther(100);
      transaction = await zoboToken
        .connect(deployer)
        .approve(exchange.address, amount);
      result = await transaction.wait();
    });

    describe("Success", () => {
      beforeEach(async () => {
        transaction = await zoboToken
          .connect(exchange)
          .transferFrom(deployer.address, receiver.address, amount);
        result = await transaction.wait();
      });

      it("transfers zoboToken balances", async () => {
        expect(await zoboToken.balanceOf(deployer.address)).to.be.equal(
          ethers.utils.parseUnits("999900", "ether")
        );
        expect(await zoboToken.balanceOf(receiver.address)).to.be.equal(amount);
      });

      it("resets the allowance", async () => {
        expect(
          await zoboToken.allowance(deployer.address, exchange.address)
        ).to.be.equal(0);
      });

      it("emits a Transfer event", async () => {
        const event = result.events[0];
        expect(event.event).to.equal("Transfer");

        const args = event.args;
        expect(args.from).to.equal(deployer.address);
        expect(args.to).to.equal(receiver.address);
        expect(args.value).to.equal(amount);
      });
    });

    describe("Failure", async () => {
      const invalidAmount = tokensToEther(100000000);

      it("rejects invalid spenders", async () => {
        await expect(
          zoboToken
            .connect(exchange)
            .transferFrom(deployer.address, receiver.address, invalidAmount)
        ).to.be.reverted;
      });
    });
  });
});
