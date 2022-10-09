const { render } = require('ejs');
const db = require('../database/models/index');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => { res.render('recommendedMovies.ejs', { movies }); });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll({
            order: ['name']
        })
            .then(genres => res.render('moviesAdd', { genres }))
            .catch(error => console.log(error))



    },
    create: function (req, res) {
        const { title, rating, awards, release_date, length, genre } = req.body
        db.Movie.create({
            title: title.trim(),
            rating,
            awards,
            release_date,
            length,
            genre_id: genre
        })
            .then(movie => {
                console.log(movie)
                return res.redirect('/movies')
            })
            .catch(error => { console.log(error) })

    },
    edit: function (req, res) {

        const Movie = db.Movie.findByPk(req.params.id)//aca llamo a lo que viene por parametro como id
            .then(Movie => res.render('moviesEdit', {
                Movie
            })
            )
            .catch(error => { console.log(error) })

    },
    update: function (req, res) {
        const {title,rating,awards,length,release_date}= req.body
        Movies.update(
            {
                title : title.trim(),
                rating,
                length,
                awards,
                release_date
            },
            {//cual modofico? el que figura con id igual al params.id
                where : {id : req.params.id}
            }
        ).then( () => res.redirect('/movies/detail/' + req.params.id))
        .catch(error => console.log(error))
    
        // TODO
    },
    delete: function (req, res) {
        // TODO
        db.Movie.findByPk(req.params.id).then((Movie) => {
            res.render('moviesDelete.ejs', { Movie });
          });
    },
    destroy: function (req, res) {
        // TODO
        db.Movie.destroy({
            where: { id: req.params.id },
          });
          res.redirect('/movies');
    }
}

module.exports = moviesController;