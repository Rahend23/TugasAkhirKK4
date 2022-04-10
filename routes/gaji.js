var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET gaji page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM gaji",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("gaji/listgaji", {
          title: "gaji",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var gaji = {
        id: req.params.id,
      };

      var delete_sql = "delete from gaji where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          gaji,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/gaji");
            } else {
              req.flash("msg_info", "Hapus Data Berhasil");
              res.redirect("/gaji");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM gaji where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/gaji");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "gaji can't be find!");
              res.redirect("/gaji");
            } else {
              console.log(rows);
              res.render("gaji/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("nama", "Please fill the name").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_nama = req.sanitize("nama").escape().trim();
      v_gajibersih = req.sanitize("gajibersih").escape().trim();
      v_gajibonus = req.sanitize("gajibonus").escape().trim();
      
      var gaji = {
        nama: v_nama,
        gajibersih: v_gajibersih,
        gajibonus: v_gajibonus,
     
      };

      var update_sql = "update gaji SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          gaji,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("gaji/edit", {
                nama: req.param("nama"),
                gajibersih: req.param("gajibersih"),
                gajibonus: req.param("gajibonus"),
                
              });
            } else {
              req.flash("msg_info", "Update Data Gaji Berhasil");
              res.redirect("/gaji");
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/gaji/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("nama", "Please fill the name").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
      v_nama = req.sanitize("nama").escape().trim();
      v_gajibersih = req.sanitize("gajibersih").escape().trim();
      v_gajibonus = req.sanitize("gajibonus").escape().trim();

    var gaji = {
      nama: v_nama,
        gajibersih: v_gajibersih,
        gajibonus: v_gajibonus,
    };

    var insert_sql = "INSERT INTO gaji SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        gaji,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("gaji/add-gaji", {
              nama: req.param("nama"),
              gajibersih: req.param("gajibersih"),
              gajibonus: req.param("gajibonus"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Tambah Data Gaji Berhasil");
            res.redirect("/gaji");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("gaji/add-gaji", {
      nama: req.param("nama"),
      gajibersih: req.param("gajibersih"),
      gajibonus: req.param("gajibonus"),
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("gaji/add-gaji", {
    title: "Add New gaji",
    nama: "",
    gajibersih: "",
    gajibonus: "",
    
    session_store: req.session,
  });
});

module.exports = router;