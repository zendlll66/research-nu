require('dotenv').config();  // โหลดไฟล์ .env
var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'login';
const multer = require('multer');

// ใช้ CORS เพื่ออนุญาตให้เข้าถึงจากไคลเอนต์
app.use(cors());

// เชื่อมต่อฐานข้อมูล mydb
const mysql = require('mysql2');

// ดึงข้อมูลการเชื่อมต่อจาก .env
const connection = mysql.createConnection(process.env.DATABASE_URL);

// กำหนดการจัดเก็บไฟล์ด้วย multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/image'); // กำหนดตำแหน่งที่จัดเก็บไฟล์
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

app.get('/',function(req,res,next){
    res.json({msg: "hi"})
})

app.get('/attractions',function(req,res,next){
    connection.query(
        'SELECT * FROM attractions',
        function(err,results,failed){
            res.json(results)
        }
    )
})



// สมัครสมาชิกผู้ใช้ใหม่
app.post('/register', jsonParser, function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if (err) {
            res.json({ status: 'error', message: err });
            return;
        }

        connection.execute(
            'INSERT INTO user (email, password, fname, lname) VALUES (?, ?, ?, ?)',
            [req.body.email, hash, req.body.fname, req.body.lname],
            function(err, results) {
                if (err) {
                    res.json({ status: 'error', message: err });
                    return;
                }
                res.json({ status: 'ok' });
            }
        );
    });
});

// เข้าสู่ระบบผู้ใช้
app.post('/login', jsonParser, function (req, res) {
    connection.execute(
        'SELECT * FROM user WHERE email = ?',
        [req.body.email],
        function (err, user) {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            if (user.length === 0) {
                res.json({ status: 'error', message: 'no user found' });
                return;
            }

            bcrypt.compare(req.body.password, user[0].password, function (err, isLogin) {
                if (err) {
                    res.json({ status: 'error', message: err });
                    return;
                }
                if (isLogin) {
                    var token = jwt.sign({ email: user[0].email }, secret, { expiresIn: '1h' });
                    res.json({ status: 'ok', message: 'login success', token });
                } else {
                    res.json({ status: 'error', message: 'login failed' });
                }
            });
        }
    );
});

// ตรวจสอบสิทธิ์ผู้ใช้ด้วย token
app.post('/authen', jsonParser, function (req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        var decoded = jwt.verify(token, secret);
        res.json({ status: 'ok', decoded });
    } catch (err) {
        res.json({ status: 'error', message: err.message });
    }
});

// เก็บข้อมูลวิจัย (Research) ใหม่
app.post('/research', upload.array('files', 10), (req, res) => {
    const name = req.body.name;
    const title = req.body.title;
    const images = req.files.map(file => file.filename); // เก็บชื่อไฟล์ทั้งหมดใน array
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // เวลาปัจจุบันในรูปแบบฐานข้อมูล MySQL

    connection.execute(
        'INSERT INTO research (name, title, image) VALUES (?, ?, ?)',
        [name, title, JSON.stringify(images)], // เก็บ array ของชื่อไฟล์เป็น JSON string ในฐานข้อมูล
        function (err, results) {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({
                status: 'ok',
                message: 'Research added successfully',
                researchId: results.insertId,
                uploadedFiles: images,
                time: currentTime
            });
        }
    );
});

// อ่านข้อมูลวิจัยทั้งหมด
app.get('/all-research', function (req, res) {
    connection.query(
        'SELECT id, name, title, image, time FROM research',
        function (err, results) {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'ok', allResearch: results });
        }
    );
});

// อ่านข้อมูลวิจัยตาม ID
app.get('/research/:id', function (req, res) {
    connection.execute(
        'SELECT * FROM research WHERE id = ?',
        [req.params.id],
        function (err, results) {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            if (results.length === 0) {
                res.json({ status: 'error', message: 'Research not found' });
                return;
            }
            res.json({ status: 'ok', research: results[0] });
        }
    );
});

// อัปเดตข้อมูลวิจัย
app.put('/research/:id', upload.array('files', 10), function (req, res) {
    const name = req.body.name;
    const title = req.body.title;
    const images = req.files.map(file => file.filename).join(','); // รวบรวมชื่อไฟล์ทั้งหมด
    const imageData = images.length > 0 ? images : req.body.image; // ใช้ข้อมูลเดิมหากไม่มีการอัปโหลดไฟล์ใหม่

    connection.execute(
        'UPDATE research SET name = ?, title = ?, image = ? WHERE id = ?',
        [name, title, imageData, req.params.id],
        function (err, results) {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'ok', message: 'Research updated successfully' });
        }
    );
});

// ลบข้อมูลวิจัย
app.delete('/research/:id', function (req, res) {
    connection.execute(
        'DELETE FROM research WHERE id = ?',
        [req.params.id],
        function (err, results) {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'ok', message: 'Research deleted successfully' });
        }
    );
});

// รันแอปพลิเคชัน
app.listen(process.env.PORT||3306)