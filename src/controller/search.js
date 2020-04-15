// search page

exports.getSearchPage = (req, res) => {
  if (req.user) {
    // User Signed In
    res.render("search",
        {
          userNickname: req.user.userNickname,
          signedOut: false,
          avatar: req.user.userAvatarUrl,
        });
  } else {
    res.render("search", {signedOut: true});
  }
};