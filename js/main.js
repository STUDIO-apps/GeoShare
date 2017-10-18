//Layout

var isShowingRightNav = false;

function showRightNav() {
  if (!isShowingRightNav) {
    document.getElementById('right-nav').className = 'right-nav open';
    isShowingRightNav = true;
  } else {
    document.getElementById('right-nav').className = 'right-nav closed';
    isShowingRightNav = false;
  }
}

function showSettings(show) {
  if (show) {
    document.getElementById('settings-background').style.display = 'block';
    document.getElementById('settings-container').className = 'settings-container open';
    history.pushState('settings', 'Settings - GeoShare', 'map?mode=settings');
  } else {
    document.getElementById('settings-background').style.display = 'none';
    document.getElementById('settings-container').className = 'settings-container closed';
    window.history.pushState('map', 'Map - GeoShare', 'map');
  }
}

function showFriendsManager() {
  if (!isShowingManager) {
    isShowingManager = true;
    showManager();
  } else {
    isShowingManager = false;
    hideManager();
  }
}

function showManager() {
  document.getElementById('list-item-maps').style.display = 'none';
  document.getElementById('header').style.display = 'none';
  document.getElementById('nav-items').style.height = 'calc(100% - 56px)';
  document.getElementById('list-item-friend-manager').className = 'list_item selected';
  document.getElementById('friend-manager-container').style.display = 'inline-block';
  document.getElementById('image-friends-manager').src = 'img/back.png';
  history.pushState('settings', 'Settings - GeoShare', 'map?mode=manager');
}

function hideManager() {
  document.getElementById('list-item-maps').style.display = '';
  document.getElementById('header').style.display = '';
  document.getElementById('nav-items').style.height = 'calc(100% - 277px - 56px)';
  document.getElementById('list-item-friend-manager').className = 'list_item';
  document.getElementById('friend-manager-container').style.display = 'none';
  document.getElementById('image-friends-manager').src = 'img/people.png';
  window.history.pushState('map', 'Map - GeoShare', 'map');
}

function changeTab(tab) {
  switch (tab) {
    case 0:
      document.getElementById('tab-0-content').className = 'current-tab';
      document.getElementById('tab-1-content').className = 'pending-tab out-view';

      document.getElementById('tab-0').className = 'tab selected';
      document.getElementById('tab-1').className = 'tab';
      break;
    case 1:
      document.getElementById('tab-0-content').className = 'current-tab out-view';
      document.getElementById('tab-1-content').className = 'pending-tab';

      document.getElementById('tab-0').className = 'tab';
      document.getElementById('tab-1').className = 'tab selected';
      break;
    default:

  }
}

var hasRecent = false;
function showFindFriends(show) {
  if (show) {
    if (!hasRecent) {
      getRecentSearch();
    }
    hasRecent = true;
    document.getElementById('friend-search-container').style.display = 'block';
    history.pushState('settings', 'Search - GeoShare', 'map?mode=search');
  } else {
    document.getElementById('friend-search-container').style.display = 'none';
    window.history.pushState('map', 'Map - GeoShare', 'map?mode=manager');
  }
}

// Image scale

function scaleImage(x, y, width, height, radius, img){
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.clip();
  ctx.drawImage(img, 0, 0, width, height);
  ctx.restore();

  return canvas;
}
