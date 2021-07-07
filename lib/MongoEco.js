const Mongoose = require('mongoose');
const data = require('../models/member')
const Guildd = require('../models/guildSettings')


class MongoEco {
  /**
   * Connecting To The Database
  */
  constructor(dbUrl) {
    if (!dbUrl) throw new TypeError("dbUrl was not provided!");
    this.token = dbUrl;
    Mongoose.connect(this.token, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
      .then((connection) => {
        this.connected = true;
        this.mongoClient = connection;
        console.log(" connected")
      })
      .catch((e) => {
        throw new TypeError(`An Error Just Occurred. ${e}`);
      })

  }
  /**
   * SetWeekly
   * @param GuildID
   * @param AMOUNT
   */
  async SetWeekly(GuildID, Amt) {
    let GuildData = await Guildd.findOne({
      gid: GuildID
    })
    if (!GuildData) {
      let Add = new Guildd({
        gid: GuildID,
        weeklyAmt: Number(Amt)
      });
      await Add.save()
    }
    GuildData.weeklyAmt = Number(Amt)
    GuildData.save()
    return GuildData
  }

  /**
   * SetDaily
   * @param GuildID
   * @param AMOUNT
   */
  async SetDaily(GuildID, Amt) {
    let GuildData = await Guildd.findOne({
      gid: GuildID
    })
    if (!GuildData) {
      let Add = new Guildd({
        gid: GuildID,
        dailyAmt: Number(Amt)
      });
      await Add.save()
    }
    GuildData.dailyAmt = Number(Amt)
    GuildData.save()
    return GuildData
  }


  /**
    * Transfer
    * @param GuildID
    * @param GIVER ID
    * @param RECIEVER ID
    * @param AMOUNT 
    */
  async Transfer(GuildID, User1ID, User2ID, Amt) {
    if (!GuildID) throw new TypeError("A member ID must be specified");
    if (!User1ID) throw new TypeError("A User  must be specified.");
    if (!User1ID) throw new TypeError("A User  must be specified.");
    if (!Amt) throw new TypeError("A Amount to exchange  must be specified.");
    let User1Data = await data.findOne({
      gid: GuildID,
      userID: User1ID
    })
    let User2Data = await data.findOne({
      gid: GuildID,
      userID: User2ID
    })
    if (!User1Data) {
      let AddUser = new data({
        userID: User1ID,
        gid: GuildID,
      });

      await AddUser.save()
      return 'NOT_ENOUGH_CASH'
    } else if (!User2Data) {
      let AddUser = new data({
        userID: User2ID,
        gid: GuildID,
        wallet: Number(Amt)
      });

      await AddUser.save()
      return AddUser
    }
    else {
      if (User1Data.wallet < Amt) {
        return 'NOT_ENOUGH_CASH'
      }
      User1Data.wallet -= Number(Amt)
      User2Data.wallet += Number(Amt)
      await User1Data.save()
      await User2Data.save()
      return { USER1: User1Data, USER2: User2Data }
    }
  }


  /**
    * RemoveItem
    * @param GuildID
    * @param ITEM ID
    */
  async RemoveItem(GuildID, ItemID) {
    if (!GuildID) throw new TypeError("A member ID must be specified");
    if (!ItemID) throw new TypeError("A ItemName  must be specified.");
    let GuildData = await Guildd.findOne({
      gid: GuildID
    })
    if (!GuildData) {
      return 'NO_ITEMS'
    }

    GuildData.shopItems = GuildData.shopItems.filter(item => item.id != ItemID);

    await GuildData.save()
    return GuildData
  }


  /**
   * AddItem
   * @param GuildID
   * @param ITEM NAME
   * @param ITEM PRICE
   * @param ITEM SELLING PRICE
   */
  async AddItem(GuildID, ItemName, Price, SellPrice) {
    if (!GuildID) throw new TypeError("A member ID must be specified");
    if (!ItemName) throw new TypeError("A ItemName  must be specified.");
    if (!Price) throw new TypeError("A Price must be specified");
    if (!SellPrice) throw new TypeError("A SellPrice  must be specified.");
    let GuildData = await Guildd.findOne({
      gid: GuildID
    })
    if (!GuildData) {
      let Add = new Guildd({
        gid: GuildID,
      });
      let Item = { Name: ItemName, Price: Price, Sell: SellPrice, id: 0 }
      Add.shopItems.push(Item)
      await Add.save()
      return Add
    }
    let Item = { Name: ItemName, Price: Price, Sell: SellPrice, id: GuildData.shopItems.length }
    GuildData.shopItems.push(Item)
    await GuildData.save()
    return GuildData
  }

  /**
   * Buyitem
   * @param UserID
   * @param GuildID
   * @param ITEM ID
   */
  async Buyitem(UserID, GuildID, ItemN) {
    if (!UserID) throw new TypeError("A member ID must be specified");
    if (!GuildID) throw new TypeError("A Guild ID must be specified");
    let Shop = await Guildd.findOne({
      gid: GuildID
    })

    if (!Shop) {
      return false
    }

    let itemName = await Shop.shopItems.filter(item => item.Name === ItemN);
    console.log(itemName[0])
    let UserData = await data.findOne({
      gid: GuildID,
      userID: UserID

    })
    if (UserData.wallet < itemName[0].Price) {
      return 'NOT_ENOUGH_CASH'
    }
    if (!UserData) {
      let AddUser = new data({
        userID: UserID,
        gid: GuildID,
      });

      await AddUser.save()
      return 'NOT_ENOUGH_CASH'
    }
    else {
      if (UserData.inventory.length === 0) {
        UserData.inventory.push(itemName[0])
        UserData.wallet -= Number(itemName[0].Price)
        await UserData.save()
        return itemName[0]
      }
      if (UserData.inventory.forEach((item1) => item1.Name === ItemN)) {
        return 'ALREADY_PURCHASED'
      }
      else {
        UserData.inventory.push(itemName[0])
        UserData.wallet -= Number(itemName[0].Price)
        await UserData.save()
        return itemName[0]
      }


    }

  }



  /**
    * SellItem
    * @param UserID
    * @param GuildID
    * @param ITEM ID
    */
  async SellItem(UserID, GuildID, ItemN) {
    if (!UserID) throw new TypeError("A member ID must be specified");
    if (!GuildID) throw new TypeError("A Item ID must be specified");
    let Shop = await Guildd.findOne({
      gid: GuildID
    })
    if (!Shop) {
      return false
    }
    let itemName = await Shop.shopItems.filter(item => item.Name === ItemN);
    let UserData = await data.findOne({
      gid: GuildID,
      userID: UserID

    })
    if (!UserData) {
      let AddUser = new data({
        userID: UserID,
        gid: GuildID,
      });

      await AddUser.save()
      return 'NOT_PURCHASED'
    }
    if (UserData.inventory.length === 0) {
      return 'NOT_PURCHASED'

    }
    else if ((UserData.inventory.filter(item => item.Name !== itemName[0].Name))) {
      return 'NOT_PURCHASED'
    }
    else if (UserData.inventory.filter(item => item.Name === itemName[0].Name)) {
      UserData.inventory = UserData.inventory.filter(item => item.Name != ItemN);
      UserData.wallet += Number(itemName[0].Sell)
      await UserData.save()
      return itemName[0]

    }



  }
  /**
     * Daily
     * @param UserID
     * @param GuildID
  */

  async Daily(UserID, GuildID) {
    let UserData = await data.findOne({
      userID: UserID,
      gid: GuildID
    })
    let GuildData = await Guildd.findOne({
      gid: GuildID
    })
    let AMT;
    if (!GuildData) {
      AMT = 2000
    }
    if (GuildData) {
      AMT = GuildData.dailyAmt
    }
    let timeout = 86400000;
    if (!UserData) {
      let AddUser = new data({
        userID: UserID,
        gid: GuildID,
        wallet: Number(AMT),
        lastUsedDaily: Date.now()


      });

      await AddUser.save()
      return AddUser.wallet
    }
    let daily = UserData.lastUsedDaily;
    if (daily !== null && timeout - (Date.now() - daily) > 0) {
      return "ALREADY_USED"
    }
    else {
      UserData.wallet += Number(AMT);
      UserData.lastUsedDaily = Date.now()
      await UserData.save()
      return UserData.wallet;
    }

  }
  /**
    * Weekly
    * @param UserID
    * @param GuildID
  */

  async Weekly(UserID, GuildID) {
    let UserData = await data.findOne({
      userID: UserID,
      gid: GuildID
    })
    let GuildData = await Guildd.findOne({
      gid: GuildID
    })
    let AMT;
    if (!GuildData) {
      AMT = 10000
    }
    if (GuildData) {
      AMT = GuildData.weeklyAmt
    }
    let timeout = 604800000;
    if (!UserData) {
      let AddUser = new data({
        userID: UserID,
        gid: GuildID,
        wallet: Number(AMT),
        lastUsedWeekly: Date.now()


      });

      await AddUser.save()
      return AddUser.wallet
    }
    let weekly = UserData.lastUsedWeekly;
    if (weekly !== null && timeout - (Date.now() - weekly) > 0) {
      return "ALREADY_USED"
    }
    else {
      UserData.wallet += Number(AMT)
      UserData.lastUsedWeekly = Date.now()
      await UserData.save()
      return UserData.wallet;
    }

  }
  /**
        * GetInv
        * @param {String} UserID 
        * @param {String} GuildID 
        */
  async GetInv(UserID, GuildID) {
    // Required Parameters
    if (!UserID) throw new TypeError("A member ID must be specified");
    if (!GuildID) throw new TypeError("A guild id must be specified.");

    let User = await data.findOne({
      userID: UserID,
      gid: GuildID
    })
    if (!User) {
      let AddUser = new data({
        userID: UserID,
        gid: GuildID,
      });

      await AddUser.save()

      return AddUser.inventory
    }
    return User.inventory
  }

  /**
      * GetUser
      * @param {String} UserID 
      * @param {String} GuildID 
      */
  async GetUser(UserID, GuildID) {
    // Required Parameters
    if (!UserID) throw new TypeError("A member ID must be specified");
    if (!GuildID) throw new TypeError("A guild id must be specified.");

    let User = await data.findOne({
      userID: UserID,
      gid: GuildID
    })
    if (!User) {
      let AddUser = new data({
        userID: UserID,
        gid: GuildID,
      });

      await AddUser.save()

      return AddUser
    }
    return User
  }
  /**
      * GetBal
      * @param {String} UserID 
      * @param {String} GuildID 
      */
  async GetBal(UserID, GuildID) {
    // Required Parameters
    if (!UserID) throw new TypeError("A member ID must be specified");
    if (!GuildID) throw new TypeError("A guild id must be specified.");

    let Bal = await data.findOne({
      userID: UserID,
      gid: GuildID
    })
    if (!Bal) {
      let AddUser = new data({
        userID: UserID,
        gid: GuildID,
      });

      await AddUser.save()

      return AddUser.wallet
    }
    return Bal.wallet
  }

  /**
     * GetBankbal
     * @param {String} UserID 
     * @param {String} GuildID 
     */
  async GetBankbal(UserID, GuildID) {
    // Required Parameters
    if (!UserID) throw new TypeError("A member ID must be specified");
    if (!GuildID) throw new TypeError("A guild id must be specified.");

    let Bal = await data.findOne({
      userID: UserID,
      gid: GuildID
    })
    if (!Bal) {
      let AddUser = new data({
        userID: UserID,
        gid: GuildID,
      });

      await AddUser.save()

      return AddUser.bank
    }
    return Bal.bank
  }
  /**
   * AddMoney
   * @param {String} UserID 
   * @param {String} GuildID
   * @param {number} Amount To Add 
   */

  async AddMoney(UserID, GuildID, Amt) {
    // Required Parameters
    if (!UserID) throw new TypeError("A member ID must be specified");
    if (!GuildID) throw new TypeError("A guild id must be specified.");
    if (!Amt) throw new TypeError("An amount of money must be specified.");

    //Find Data In DB
    let UserData = await data.findOne({
      userID: UserID,
      gid: GuildID
    });
    //Create Data If None Is Found
    if (!UserData) {
      let AddUser = new data({
        userID: UserID,
        gid: GuildID,
        wallet: Number(Amt)
      });

      await AddUser.save()

      return AddUser.wallet
    };
    // Update Wallet
    UserData.wallet += Number(Amt);

    await UserData.save()

    return UserData.wallet;
  }

  /**
     * RemoveMoney
     * @param {String} UserID 
     * @param {String} GuildID
     * @param {number} Amount To Remove 
     */

  async RemoveMoney(UserID, GuildID, Amt) {
    // Required Parameters
    if (!UserID) throw new TypeError("A member ID must be specified");
    if (!GuildID) throw new TypeError("A guild id must be specified.");
    if (!Amt) throw new TypeError("An amount of money must be specified.");

    //Find Data In DB
    let UserData = await data.findOne({
      userID: UserID,
      gid: GuildID
    });
    //If None Is Found
    if (!UserData) {
      return
    };
    // Update Wallet
    UserData.wallet -= Number(Amt);

    await UserData.save()

    return UserData.wallet;
  }

  /**
  * LeaderBoard
  * @param {string} guildId - The id of the guild
  */
  async LeaderBoard(GuildID) {
    if (!GuildID) throw new TypeError("A guild id must be specified.");
    let limit = "10";

    let lb = await data.find({
      gid: GuildID
    }).sort([
      ['wallet', 'descending']
    ]).exec().catch((e) => {
      throw new TypeError(`An Error Just Occurred. ${e}`);
    })
    return lb.slice(0, limit);
  }
  /**
     * Deposit
     * @param {String} UserID 
     * @param {String} GuildID
     * @param {number} Amount To Deposit 
     */

  async Deposit(UserID, GuildID, Amt) {
    if (!UserID) throw new SyntaxError("A member ID must be specified.")
    if (!GuildID) throw new SyntaxError("A guild ID must be specified.")
    if (!Amt) throw new SyntaxError("An amount must be specified.");


    let Balance = await data.findOne({
      userID: UserID,
      gid: GuildID
    });

    if (!Balance) {
      Balance = await data({
        userID: UserID,
        gid: GuildID,

      });
      await Balance.save()
      return "CASH_IN_WALLET"

    }
    if (Balance.wallet < Amt) {
      return "CASH_IN_WALLET"
    }
    Balance.bank += Number(Amt);
    Balance.wallet -= Number(Amt);

    await Balance.save()

    return { "wallet": Balance.wallet, "Bank": Balance.bank };
  }
  /**
     * Withdraw
     * @param {String} UserID 
     * @param {String} GuildID
     * @param {number} Amount To Withdraw 
     */

  async Withdraw(UserID, GuildID, Amt) {
    if (!UserID) throw new SyntaxError("A member ID must be specified.")
    if (!GuildID) throw new SyntaxError("A guild ID must be specified.")
    if (!Amt) throw new SyntaxError("An amount must be specified.");


    let Balance = await data.findOne({
      userID: UserID,
      gid: GuildID
    });

    if (!Balance) {
      Balance = await data({
        userID: UserID,
        gid: GuildID,
      });
      await Balance.save()
      return "CASH_IN_BANK"
    }
    if (Balance.bank < Amt) {
      return  "CASH_IN_BANK"
    }
    Balance.bank -= Number(Amt);
    Balance.wallet += Number(Amt);

    await Balance.save()

    return { "wallet": Balance.wallet, "Bank": Balance.bank };
  }

  /**
        * GetShop
        * @param {String} UserID 
        * @param {String} GuildID 
        */
  async GetShop(GuildID) {
    // Required Parameters

    if (!GuildID) throw new TypeError("A guild id must be specified.");

    let User = await Guildd.findOne({
      gid: GuildID
    })
    if (!User) {
      let AddUser = new data({
        gid: GuildID,
      });

      await AddUser.save()

      return AddUser.shopItems
    }
    return User.shopItems
  }

}

module.exports = MongoEco;
