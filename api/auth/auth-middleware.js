const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/index");
const bcrypt = require("bcryptjs");
const User = require("../users/user-model");

const restricted = (req, res, next) => {
  const token = req.headers.authorization; //tokenı aldık
  if (token) {
    //token var ve geçerli
    jwt.verify(token, JWT_SECRET, (err, decodedJWT) => {
      //verify 3 tane argüman alıyor token secret hata varsa err düşecek yoksa decodedJWT
      if (err) {
        //token var,geçersiz
        next({
          status: 401,
          message: "Geçersiz token",
        });
      } else {
        //token var geçerli
        req.userInfo = decodedJWT;
        next(); //kullanıcyı bir sonraki middleware gönderiyoruz
      }
    });
  } else {
    next({ status: 401, message: "Token yok" });
  }
};

const payLoadCheck = async function (req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ message: "Name,email ve password alanlarını doldurun" });
    } else {
      req.encPassword = await bcrypt.hash(req.body.password, 8); //şifreyi hashledik
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkNameEmail = async function (req, res, next) {
  try {
    const { name, email } = req.body;
    let nameControl = await User.findByFilter({ name: name });
    let emailControl = await User.findByFilter({ email: email });
    if (nameControl) {
      res.status(401).json({
        message:
          "Kullanıcı ismi daha önceden alınmış,yeni kullanıcı ismi deneyin",
      });
    } else if (emailControl) {
      res.status(401).json({
        message: "Email adresi ile önceden oturum açılmış",
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};
const passwordCheck = async function (req, res, next) {
  try {
    let user = await User.findByFilter({
      name: req.body.name,
    });
    if (!user) {
      next({
        status: 401,
        message: "geçersiz kriterler",
      });
    } else {
      const { password } = req.body;
      let isTruePassword = bcrypt.compareSync(password, user.password);
      if (!isTruePassword) {
        next({
          status: 401,
          message: "geçersiz kriterler",
        });
      } else {
        req.user = user;
        next();
      }
    }
  } catch (error) {
    next(error);
  }
};
const payLoadCheckLogin = async function (req, res, next) {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      res.status(400).json({ message: "Name, password alanlarını doldurun" });
    } else {
      req.encPassword = await bcrypt.hash(req.body.password, 8); //şifreyi hashledik
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  restricted,
  payLoadCheck,
  checkNameEmail,
  passwordCheck,
  payLoadCheckLogin,
};
