const { ethers } = require("hardhat");
const { expect } = require("chai");
const { result } = require("lodash");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", () => {
  let token, accounts, deployer, receiver;
  beforeEach(async () => {
    // Fetch Token from Blochchain
    const Token = await ethers.getContractFactory("Token");

    // Deploy contract
    token = await Token.deploy("ZoboSwap", "ZSP", 1000000);

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    receiver = accounts[1];
  });

  describe("Deployment", () => {
    const name = "ZoboSwap";
    const symbol = "ZSP";
    const decimals = 18;
    const totalSupply = tokens(1000000);

    it("Has a name", async () => {
      // Read Token Name and  Check that name is correct
      expect(await token.name()).to.equal(name);
    });

    it("Has a Symbol", async () => {
      // Read Token from Symbol and Check that Symbol is correct
      expect(await token.symbol()).to.equal(symbol);
    });

    it("Has correct decimals", async () => {
      // Read Token from Symbol and Check that Symbol is correct
      expect(await token.decimals()).to.equal(decimals);
    });
    it("Has correct Total Supply", async () => {
      // Read Token from Symbol and Check that Symbol is correct
      expect(await token.totalSupply()).to.equal(totalSupply);
    });
    it("Assigns total supply to deployer", async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
    });
  });

  describe("Sending  Tokens", async () => {
    let amount, transaction, result;
    describe("Success", () => {
      beforeEach(async () => {
        // Transfer tokens
        amount = tokens(100);
        transaction = await token
          .connect(deployer)
          .transfer(receiver.address, amount);
        result = await transaction.wait();
      });

      it("transfer token balance", async () => {
        // Ensure that the token is transferred (balance changed)
        expect(await token.balanceOf(deployer.address)).to.equal(
          tokens(999900)
        );
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
      });

      it("emits a transfer event", async () => {
        const event = result.events[0];
        const args = event.args;
        expect(event.event).to.equal("Transfer");
        expect(args.from).to.equal(deployer.address);
        expect(args.to).to.equal(receiver.address);
        expect(args.value).to.equal(amount);
      });
    });
    describe("Failure", () => {
      it("rejects Insufficient balances", async () => {
        const invalidAmount = tokens(1000000);

        expect(
          token.connect(deployer).transfer(receiver.address, invalidAmount)
        ).to.be.reverted;
      });

      it("rejects invalid recipients", async () => {
        expect(token.connect(deployer).transfer("0000000000", amount)).to.be
          .reverted;
      });
    });
  });
});
