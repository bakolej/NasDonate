#Nebulas Donate

The dapp allows you to accept or make donations with a message to the recipient. You can see the list of your donations in your personal account. All donations are immediately transferred to the wallet of the profile owner.

To start accepting donations, you just need to register a profile. Then you can give people a readable link like *nasdonate.com/to/nickname*


### Smart contract

- `totalProfiles()` - Returns the total number of profiles.

- `totalDonates()` - Returns the total number of donations.

- `saveProfile(profileJson)` - Saves the profile.

- `getProfiles(limit, offset)` - Returns profiles.

- `getProfileByWallet(wallet)` - Returns a profile with the specified wallet.

- `getProfileById(id)` - Returns a profile with the specified Id.

- `donate(profileId, author, message, date)` - Makes a donation.

- `getDonates(limit, offset)` - Returns the list of donations.

- `getDonatesFrom(wallet)` - Returns donations made from the wallet.

- `getDonatesTo(wallet)` - Returns donations made to the specified wallet.