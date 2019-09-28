function hide(elem) {
    elem.style.display = 'none';
};

function show(elem) {
    elem.style.display = 'inline-block';
};

function generateFriendsHeading() {
    let dotColors = ['#e91e22', '#04AFE2', '#fbc116','#e91e22', '#04AFE2', '#fbc116'];
    let friends = 'FRIENDS'.split('');
    let FRIENDS = [];

    friends.forEach((letter, i) => {
        let span;
        if (dotColors[i]) {
            span = `<span style="color: ${dotColors[i]};">&#183</span>`;
        }
        FRIENDS.push(letter, span);
    });

    let friendsHeading = document.getElementById('friends');
    friendsHeading.innerHTML = FRIENDS.join('');
};

generateFriendsHeading();

function generateCards() {
    
};

