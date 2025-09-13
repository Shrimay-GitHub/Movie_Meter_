const mongoose = require('mongoose');
const Movie = require('./models/models/Movie');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const movies = [
    // Original 10 movies
    { title: "Inception", release: "2010", img: "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg", defaultRating: 4.8 },
    { title: "Titanic", release: "1997", img: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg", defaultRating: 4.7 },
    { title: "Interstellar", release: "2014", img: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", defaultRating: 4.9 },
    { title: "The Dark Knight", release: "2008", img: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", defaultRating: 4.9 },
    { title: "Avengers: Endgame", release: "2019", img: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", defaultRating: 4.7 },
    { title: "The Godfather", release: "1972", img: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", defaultRating: 4.9 },
    { title: "Forrest Gump", release: "1994", img: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", defaultRating: 4.8 },
    { title: "The Matrix", release: "1999", img: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", defaultRating: 4.8 },
    { title: "Gladiator", release: "2000", img: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg", defaultRating: 4.7 },
    { title: "Shawshank Redemption", release: "1994", img: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", defaultRating: 5.0 },
    
    // Additional 20 movies
    { title: "Pulp Fiction", release: "1994", img: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", defaultRating: 4.8 },
    { title: "The Lord of the Rings: The Return of the King", release: "2003", img: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg", defaultRating: 4.9 },
    { title: "Fight Club", release: "1999", img: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", defaultRating: 4.7 },
    { title: "The Lion King", release: "1994", img: "https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg", defaultRating: 4.6 },
    { title: "Star Wars: Episode V - The Empire Strikes Back", release: "1980", img: "https://image.tmdb.org/t/p/w500/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg", defaultRating: 4.8 },
    { title: "Goodfellas", release: "1990", img: "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg", defaultRating: 4.7 },
    { title: "Avatar", release: "2009", img: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg", defaultRating: 4.5 },
    { title: "The Silence of the Lambs", release: "1991", img: "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg", defaultRating: 4.6 },
    { title: "Saving Private Ryan", release: "1998", img: "https://image.tmdb.org/t/p/w500/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg", defaultRating: 4.7 },
    { title: "Jurassic Park", release: "1993", img: "https://image.tmdb.org/t/p/w500/b1xCNnyrPebIc7EWNZIa6BYzSGw.jpg", defaultRating: 4.5 },
    { title: "Terminator 2: Judgment Day", release: "1991", img: "https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi2RhfjjurTqb.jpg", defaultRating: 4.6 },
    { title: "The Departed", release: "2006", img: "https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg", defaultRating: 4.5 },
    { title: "Spider-Man: No Way Home", release: "2021", img: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", defaultRating: 4.4 },
    { title: "The Prestige", release: "2006", img: "https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg", defaultRating: 4.6 },
    { title: "Back to the Future", release: "1985", img: "https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg", defaultRating: 4.5 },
    { title: "Parasite", release: "2019", img: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", defaultRating: 4.7 },
    { title: "The Avengers", release: "2012", img: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg", defaultRating: 4.4 },
    { title: "Whiplash", release: "2014", img: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg", defaultRating: 4.6 },
    { title: "The Green Mile", release: "1999", img: "https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg", defaultRating: 4.7 },
    { title: "Dune", release: "2021", img: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", defaultRating: 4.3 }
];

async function seedMovies() {
    try {
        // Clear existing movies
        await Movie.deleteMany({});
        console.log('Cleared existing movies');
        
        // Insert new movies
        await Movie.insertMany(movies);
        console.log('Movies seeded successfully!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding movies:', error);
        process.exit(1);
    }
}

seedMovies();