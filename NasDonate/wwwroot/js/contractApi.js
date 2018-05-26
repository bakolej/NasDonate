const CONTRACT_ADDRESS = "n1iqojeJZQ3ZVbPMUHS91kRGBJNpXp1kSB9"; //0748053e2696c56d945b255de636d1be7d5876e2024b4019ca7b63108de9ccc1
			
class SmartContractApi {
    constructor(contractAdress) {
        let NebPay = require("nebpay"); 
        this.nebPay = new NebPay();
        this._contractAdress = contractAdress || CONTRACT_ADDRESS;
    }

    getContractAddress() {
        return this.contractAdress;
    }

    _simulateCall({ value = "0", callArgs = "[]", callFunction , callback }) {
        this.nebPay.simulateCall(this._contractAdress, value, callFunction, callArgs, {  
            callback: function(resp){
                if(callback){
                    callback(resp);
                }           
            }   
        });
    }
    
    _call({ value = "0", callArgs = "[]", callFunction , callback }) {
        this.nebPay.call(this._contractAdress, value, callFunction, callArgs, {  
            callback: function(resp){
                if(callback){
                    callback(resp);
                }           
            }   
        });
    } 
}

class DonateContractApi extends SmartContractApi{
    saveProfile(profile, cb) {
        this._call({
            callArgs : JSON.stringify([JSON.stringify(profile)]),
            callFunction : "saveProfile", 
            callback: cb
        });
    }
    
    getTotalProfiles(cb) {
        this._simulateCall({
            callFunction : "totalProfiles", 
            callback: cb
        });
    }
    
    getProfileById(id, cb) {
        this._simulateCall({
            callArgs : `[${id}]`,
            callFunction : "getProfileById", 
            callback: cb
        });;
    }
    
    getProfileByWallet(wallet, cb) {
        this._simulateCall({
            callArgs : `["${wallet}"]`,
            callFunction : "getProfileByWallet", 
            callback: cb
        });;
    }

    getProfiles(limit, offset, cb) {
        this._simulateCall({
            callArgs : `[${limit}, ${offset}]`,
            callFunction : "getProfiles", 
            callback: cb
        });;
    }

    donate(profileId, amount, author, message, cb) {
        this._call({
            value : amount,
            callArgs : `[${profileId}, "${author}", "${message}", ${Date.now()}]`,
            callFunction : "donate", 
            callback: cb
        });;
    }

    getDonates(limit, offset, cb) {
        this._simulateCall({
            callArgs : `[${limit}, ${offset}]`,
            callFunction : "getDonates", 
            callback: cb
        });;
    }

    getDonatesFrom(wallet, cb) {
        this._simulateCall({
            callArgs : `["${wallet}"]`,
            callFunction : "getDonatesFrom", 
            callback: cb
        });;
    }

    getDonatesTo(wallet, cb) {
        this._simulateCall({
            callArgs : `["${wallet}"]`,
            callFunction : "getDonatesTo", 
            callback: cb
        });;
    }
    
}
