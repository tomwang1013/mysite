// ajax or redirect
app.post('/signup', user.signupHandler);
app.post('/login',  user.loginHandler);
app.post('/logout', user.logoutHandler);

// render page
app.get('/', servRender);
app.get('/signup', servRender);
app.get('/login', servRender);
app.get('/after_login', servRender);
app.get('/create_job', servRender);
app.get('/jobs', servRender);
app.get('/students', servRender);
