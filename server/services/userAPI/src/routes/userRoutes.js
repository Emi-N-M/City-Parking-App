'use strict'
module.exports = function (app) {
    const userCtrl =
        require('../controllers/userController');

    // Routes for API Restful userAPI / AUTH


    app.route('/signup')
        .post(userCtrl.sign_up_user);

    app.route('/login')
        .post(userCtrl.login_user);
    app.route('/readAll')
        .get(userCtrl.read_all_users)

    app.route('/:userid')
        .get(userCtrl.get_user);

    


}