function setAvatarUrl(profile, cb) {
    $.get(location.protocol + "//" + location.host + "/profile/getAvatarUrl/" + profile.wallet, function (data) {
        profile.avatar = data;
        cb();
    }).fail(cb);
}


function showLoader() {
    $(".page-content").hide();
    $(".cssload-loader").removeClass("hide");
    $(".cssload-loader").show();
}

function hideLoader() {
    $(".page-content").show();
    $(".cssload-loader").hide();
}

function loadToMeDonations() {
    $('.donate-tab.from-me').closest('.nav-item').removeClass('active');
    $('.donate-tab.to-me').closest('.nav-item').addClass('active');

    showLoader();
    $(".donations-deck").empty();    
    api.getDonatesFrom("", resp => {
        hideLoader();
        if(resp.result && !resp.result.startsWith("Error")) {
            let donates = JSON.parse(resp.result);
            donates.sort((a,b) => a.date > b.date ? -1 : 1);
            for(const donate of donates) {
                showDonateInfo(donate);
            }
        }
        else {
            $(".donations-deck").append('<div class="no-donates">You haven\'t received any donations yet</div>');
        }
    });
}

function loadFromMeDonations() {
    $('.donate-tab.from-me').closest('.nav-item').addClass('active');
    $('.donate-tab.to-me').closest('.nav-item').removeClass('active');

    showLoader();
    $(".donations-deck").empty();    
    api.getDonatesTo("", resp => {
        hideLoader();
        if(resp.result && !resp.result.startsWith("Error")) {
            let donates = JSON.parse(resp.result);
            donates.sort((a,b) => a.date > b.date ? -1 : 1);
            for(const donate of donates) {
                showDonateInfo(donate, false);
            }
        }
        else {
            $(".donations-deck").append('<div class="no-donates">You haven\'t send any donations yet</div>');
        }
    });
}

function showDonateInfo(donate, to = true) {
    let innerHtml = `<div class="donate-card">
                        <div class="donate-header d-flex justify-content-between">
                            <span class="donate-date">${convertUnixStampToScreenDate(donate.date, true)}</span>
                            <div class="donate-author">
                                <span class="nickname">
                                    ${donate.author}
                                    <span class="wallet">(${donate.from})</span>
                                </span>
                            </div>
                        </div>
                        <div class="donate-body d-flex items-align-center">
                            <div class="donate-amount ${to ? "to-me":"from-me"}">${to ? "+":"-"}${convertWeiToNas(donate.amount)} NAS</div>
                            <div class="donate-message">${donate.message || ""}</div>
                        </div>
                    </div>`;
    $(".donations-deck").append(innerHtml);
}

function showUserSidebar(profile) {
    let host = location.protocol + "//" + location.host + "/" ;
    let innerHtml = `<div class="sidebar">
                        <div class="user-card">
                            <div class="hello-user">Hi, ${profile.name}!</div>
                            <div class="d-flex flex-column align-items-center user-profile">
                                <div class="profile-body text-center">
                                    <img class="profile-avatar" src="${host}${profile.avatar}">`;                                 
          
    innerHtml += `<div class="text-center profile-contacts">`;                               
    if(profile.twitch) {
        innerHtml += `<a href="https://twitch.com/${profile.twitch}" class="contact-link" title="Twitch" data-toggle="tooltip" data-placement="bottom" target="_blank">
                        <img src="${host}img/contacts/twitch.svg">
                    </a>`;
    }

    if(profile.youtube) {
        innerHtml += `<a href="https://youtube.com/user/${profile.youtube}" class="contact-link" title="Youtube" data-toggle="tooltip" data-placement="bottom" target="_blank">
                        <img src="${host}img/contacts/youtube.svg">
                    </a>`;
    }

    if(profile.facebook) {
        innerHtml += `<a href="https://facebook.com/${profile.facebook}" class="contact-link" title="Facebook" data-toggle="tooltip" data-placement="bottom" target="_blank">
                        <img src="${host}img/contacts/facebook.svg">
                    </a>`;
    }

    if(profile.instagram) {
        innerHtml += `<a href="https://instagram.com/${profile.instagram}" class="contact-link" title="Instagram" data-toggle="tooltip" data-placement="bottom" target="_blank">
                        <img src="${host}img/contacts/instagram.svg">
                    </a>`;
    }

    if(profile.twitter) {
        innerHtml += `<a href="https://twitter.com/${profile.twitter}" class="contact-link" title="Twitter" data-toggle="tooltip" data-placement="bottom" target="_blank">
                        <img src="${host}img/contacts/twitter.svg">
                    </a>`;
    }  

    innerHtml += ` <a href="${host}profile" class="menu-link edit-profile">Edit profile</a>
    <a href="${host}donations" class="menu-link">Donations</a></div>`;     

    innerHtml +=  `</div>
                        </div>
                    </div>`;
     if(profile.alias) {
        innerHtml +=   `<div class="user-receive-link">
                            <label>Link for receive donates</label>
                            <div class="input-group">
                                <input id="receive-link" class="form-control form-control-sm " value="http://nasdonate.com/to/${profile.alias}">
                                <div class="input-group-append">
                                    <button id="copy-link" class="btn btn-outline-secondary" data-toggle="tooltip" data-placement="right" title="Copy to clipboard">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                        </div>`;
     }              
     innerHtml +=  `</div>`;

    $(".sidebar").replaceWith(innerHtml);
}

function addProfileCard(profile) {
    let host = location.protocol + "//" + location.host + "/" ;
    let hasContacts = profile.youtube || profile.twitch || profile.facebook || profile.twitter || profile.instagram;
    let innerHtml = `<div class="d-flex flex-column align-items-center profile">
                        <div class="profile-header">
                            <h3>${profile.name}</h3>
                        </div>
                        <div class="profile-body">
                            <img class="profile-avatar" src="${host}${profile.avatar || "avatars/no-avatar.png"}">`;

    if (hasContacts) {
        innerHtml += `<div class="text-center profile-contacts">`;

        if(profile.twitch) {
            innerHtml += `<a href="https://twitch.com/${profile.twitch}" class="contact-link" title="Twitch" data-toggle="tooltip" data-placement="bottom" target="_blank">
                            <img src="${host}img/contacts/twitch.svg">
                        </a>`;
        }

        if(profile.youtube) {
            innerHtml += `<a href="https://youtube.com/user/${profile.youtube}" class="contact-link" title="Youtube" data-toggle="tooltip" data-placement="bottom" target="_blank">
                            <img src="${host}img/contacts/youtube.svg">
                        </a>`;
        }

        if(profile.facebook) {
            innerHtml += `<a href="https://facebook.com/${profile.facebook}" class="contact-link" title="Facebook" data-toggle="tooltip" data-placement="bottom" target="_blank">
                            <img src="${host}img/contacts/facebook.svg">
                        </a>`;
        }

        if(profile.instagram) {
            innerHtml += `<a href="https://instagram.com/${profile.instagram}" class="contact-link" title="Instagram" data-toggle="tooltip" data-placement="bottom" target="_blank">
                            <img src="${host}img/contacts/instagram.svg">
                        </a>`;
        }

        if(profile.twitter) {
            innerHtml += `<a href="https://twitter.com/${profile.twitter}" class="contact-link" title="Twitter" data-toggle="tooltip" data-placement="bottom" target="_blank">
                            <img src="${host}img/contacts/twitter.svg">
                        </a>`;
        }
        innerHtml += `</div>`;     
    }
                            
    innerHtml +=  `</div>
                        <button type="button" class="btn btn-primary btn-donate" data-toggle="modal" data-target="#donateModal" data-profile-name="${profile.name}" data-profile-id="${profile.id}">Donate</button>
                    </div>`;

    let div = document.createElement('div');
    div.innerHTML = innerHtml;
    $(".profiles-deck").append(div.firstChild);
}


function addNoExtensionAlert() {
    let div = document.createElement('div');
    div.innerHTML = `<div class="container mb-0"><div class="alert alert-danger" role="alert">
        Please install <a href="https://github.com/ChengOrangeJu/WebExtensionWallet" class="alert-link">WebExtensionWallet</a> to use Crypto Funding.
    </div></div>`;

    let nav = document.querySelector(".main-nav");
    nav.parentNode.insertBefore(div.firstChild, nav.nextSibling);
}




