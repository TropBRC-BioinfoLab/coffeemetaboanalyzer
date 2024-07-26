const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken')
const { mongoose } = require('mongoose');
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const fs = require('fs')
const imageDownloader = require('image-downloader')
const User = require('./models/User');
const Coffee = require('./models/Coffee')
const QuantMass = require('./models/QuantMass')
const MetaboliteData = require('./models/Metabolite')

const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }))


const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'a89asf89fas8as898sa'

app.use('/uploads', express.static(__dirname + '/uploads'))
// app.use('/massSpectrum', express.static(__dirname + '/massSpectrum'))

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err
            resolve(userData)

        })
    })

}


app.get('/test', (req, res) => {
    res.json('test ok');
})

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        })
        res.json({ userDoc });
    }
    catch (e) {
        res.status(422).json(e);
    }

})

app.get('/register', async (req, res) => {
    res.json(await User.find())
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email })
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id

            }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc)
            })

        } else {
            res.status(422).json('pass not ok');
        }
    }
    else {
        res.json('not found')
    }

})

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        })
    } else {
        res.json(null)
    }

})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
})

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    })
    res.json(newName)
})

const photosMiddleware = multer({ dest: 'uploads/' })
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1]
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads\\', ''))
    }
    res.json(uploadedFiles)
})

const quantMassMiddleware = multer({ dest: 'massSpectrum/' })
app.post('/upload-massSpectrum', quantMassMiddleware.single('massSpectrum'), async (req, res) => {

    const { path, originalname } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1]
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    const x = newPath.replace('massSpectrum\\', '')

    res.json(x)
})

app.post('/quantMass', async (req, res) => {

    const { tagName, metabolites } = req.body
    const quantMassDoc = await QuantMass.create({
        tagName, datametabolite: metabolites,
    })
    res.json(quantMassDoc)

})

app.post('/metabolite', async (req, res) => {

    const { tagName, dataMetabolites } = req.body
    const MetaboliteDataDoc = await MetaboliteData.create({
        tagName, dataMetabolite: dataMetabolites.dataMetabolite,
    })
    res.json(MetaboliteDataDoc)

})



app.put('/quantMass', async (req, res) => {
    const { id, tagName, metabolites } = req.body


    const quantMassDoc = await QuantMass.findById(id)

    quantMassDoc.set({
        tagName, datametabolite: metabolites,
    })
    quantMassDoc.save()
    res.json('ok')


})

app.put('/metabolite', async (req, res) => {
    const { id, tagName, dataMetabolites } = req.body


    const MetaboliteDoc = await MetaboliteData.findById(id)

    MetaboliteDoc.set({
        tagName, dataMetabolite: dataMetabolites.dataMetabolite,
    })
    MetaboliteDoc.save()
    res.json('ok')


})

app.get('/coffees', async (req, res) => {
    res.json(await Coffee.find())
})


app.post('/coffees', (req, res) => {
    const { token } = req.cookies;
    const { name, origin, addedPhotos, description, brand, quantMass, metaboliteData,
    } = req.body
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const coffeeDoc = await Coffee.create({
            owner: userData.id, name, origin, photos: addedPhotos, description, brand, quantMass, metaboliteData,
        })
        res.json(coffeeDoc)

    })

})

app.put('/coffees', async (req, res) => {
    const { token } = req.cookies;
    const { id, name, origin, addedPhotos, description, brand, quantMass, metaboliteData,
    } = req.body

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const coffeeDoc = await Coffee.findById(id)
        if (userData.id === coffeeDoc.owner.toString()) {
            coffeeDoc.set({
                name, origin, photos: addedPhotos, description, brand, quantMass, metaboliteData,
            })
            coffeeDoc.save()
            res.json('ok')
        }

    })
})

app.delete('/coffee/:id', async (req, res) => {
    const { id } = req.params
    res.json(await Coffee.findByIdAndDelete(id))

})



app.get('/admin-coffees', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const { id } = userData;
        res.json(await Coffee.find({ owner: id }))
    })

})




app.get('/admin-quantMasses', async (req, res) => {
    res.json(await QuantMass.find())
})

app.get('/admin-metabolites', async (req, res) => {
    res.json(await MetaboliteData.find())
})

app.get('/coffees-metabolite/:id', async (req, res) => {
    const { id } = req.params
    const pipeline = [
        {
            $match: {
                $expr: {
                    $eq: [
                        "$_id",
                        {
                            $toObjectId:
                                id,
                        },
                    ],
                },
            },
        },
        {
            $lookup: {
                from: "quantmasses",
                localField: "quantMass",
                foreignField: "_id",
                as: "quantMasses",
            },
        },
        {
            $addFields: {
                quantMasses: {
                    $arrayElemAt: ["$quantMasses", 0],
                },
            },
        },
        {
            $lookup: {
                from: "metabolitedatas",
                localField: "metaboliteData",
                foreignField: "_id",
                as: "metaboliteDatas",
            },
        },
        {
            $addFields: {
                metaboliteDatas: {
                    $arrayElemAt: ["$metaboliteDatas", 0],
                },
            },
        },
        {
            $project: {

                metaboliteName:
                    "$quantMasses.datametabolite.metaboliteName",
                quantMass:
                    "$quantMasses.datametabolite.quantMass",
                metaboliteMass:
                    "$metaboliteDatas.dataMetabolite",
                massSpectrum:
                    "$quantMasses.datametabolite.massSpectrum",
                _id: 0,

            },
        },
    ];

    const metaboliteDoc = await Coffee.aggregate(pipeline)
    res.json(metaboliteDoc[0])
})

app.get('/coffees/:id', async (req, res) => {
    const { id } = req.params
    res.json(await Coffee.findById(id).populate(["quantMass", "metaboliteData"]))
})


app.get('/quantMass/:id', async (req, res) => {
    const { id } = req.params
    res.json(await QuantMass.findById(id))
})

app.delete('/quantMass/:id', async (req, res) => {
    const { id } = req.params
    res.json(await QuantMass.findByIdAndDelete(id))
})

app.get('/metabolite/:id', async (req, res) => {
    const { id } = req.params
    res.json(await MetaboliteData.findById(id))
})

app.delete('/metabolite/:id', async (req, res) => {
    const { id } = req.params
    res.json(await MetaboliteData.findByIdAndDelete(id))
})

app.get('/massSpectrum/:filename', async (req, res) => {
    const filename = req.params.filename
    res.download(`./massSpectrum/${filename}`, filename);
});



app.listen(4000);