const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", () => {
  let token;
  beforeEach(async () => {
    // Fetch Token from Blochchain
    const Token = await ethers.getContractFactory("Token");

    // Deply contract
    token = await Token.deploy("ZoboSwap", "ZSP", 1000000);
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
  });
});
