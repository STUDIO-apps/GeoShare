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
  document.getElementById('list-item-friend-manager').style.display = 'none';
  document.getElementById('header').style.display = 'none';
  document.getElementById('nav-items').style.height = 'calc(100% - 56px)';
  document.getElementById('friend-manager-container').style.display = 'inline-block';
  history.pushState('settings', 'Settings - GeoShare', 'map?mode=manager');
}

function hideManager() {
  document.getElementById('list-item-maps').style.display = '';
  document.getElementById('list-item-friend-manager').style.display = '';
  document.getElementById('header').style.display = '';
  document.getElementById('nav-items').style.height = 'calc(100% - 277px - 56px)';
  document.getElementById('friend-manager-container').style.display = 'none';
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

//var hasRecent = false;
function showFindFriends(show) {
  if (show) {
    // if (!hasRecent) {
    //   getRecentSearch();
    // }
    //hasRecent = true;
    document.getElementById('friend-search-background').style.display = 'block';
    document.getElementById('friend-search-container').className = 'friend-search-container open';
    document.getElementById('search-input').focus();
    //document.getElementById('friend-search-container').style.display = 'block';
    history.pushState('settings', 'Search - GeoShare', 'map?mode=search');
  } else {
    document.getElementById('friend-search-background').style.display = 'none';
    document.getElementById('friend-search-container').className = 'friend-search-container closed';
    document.getElementById('search-input').value = "";
    removeSearchElements();
    //document.getElementById('friend-search-container').style.display = 'none';
    window.history.pushState('map', 'Map - GeoShare', 'map?mode=manager');
  }
}
