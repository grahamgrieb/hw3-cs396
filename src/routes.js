"use strict";

const resetDB = require("../config/scripts/populateDB")

const Companion = require("./schema/Companion");
const Doctor = require("./schema/Doctor");

const express = require("express");
const FavoriteDoctor = require("./schema/FavoriteDoctor");
const FavoriteCompanion = require("./schema/FavoriteCompanion");
const router = express.Router();


// completely resets your database.
// really bad idea irl, but useful for testing
router.route("/reset")
    .get((_req, res) => {
        resetDB(() => {
            res.status(200).send({
                message: "Data has been reset."
            });
        });
    });

router.route("/")
    .get((_req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });
    
// ---------------------------------------------------
// Edit below this line
// ---------------------------------------------------
router.route("/doctors")
    .get((req, res) => {
        console.log("GET /doctors");

        // already implemented:
        Doctor.find({}).sort('ordering')
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /doctors");
        if(!req.body.name||!req.body.seasons){
            res.status(500).send({message:"needs name or seasons"});
        }
        else{
            Doctor.create(req.body).save()
            .then(doc => {
                res.status(201).send(doc);
            })
            .catch(err=>{
                res.status(500).send(err);
            })
        }
    });

// optional:
router.route("/doctors/favorites")
    .get((req, res) => {
        console.log(`GET /doctors/favorites`);
        FavoriteDoctor.find({})
        .then(favs => {
            if(favs==null){
                res.status(500).send({message:"id not found"});
            }
            else{
                Doctor.find({ _id: favs.map(fav=>fav.doctor) })
                .then(docs=>{res.status(200).send(docs)})
               
            
            }
        },
        err => {res.status(500).send({message:"id not found"});}
        );
    })
    .post((req, res) => {
        console.log(`POST /doctors/favorites`);
        Doctor.findById(req.body.doctor_id)
        .then(doc => {
            if(doc==null){
                
                res.status(500).send({message:"id not found"});
            }
            else{
                FavoriteDoctor.find({"doctor":  req.body.doctor_id })
                .then(fdoc => {
                    if(fdoc.length>0){
                        
                        res.status(500).send({message:"already exist"});
                    }
                    else{
                       
                        
                        FavoriteDoctor.create(req.body.doctor_id).save()
                        .then(doc2 => {
                             res.status(201).send(doc);
                        })
                    }
                })
                
            }
        },
        err => {res.status(500).send({message:"id not found"});}
        );
    });
    
router.route("/doctors/:id")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}`);
        Doctor.findById(req.params.id)
        .then(doc => {
            if(doc==null){
                res.status(404).send({message:"id not found"});
            }
            else{
                res.status(200).send(doc);
            }
        },
        err => {res.status(404).send({message:"id not found"});}
        );
    })
    .patch((req, res) => {
        console.log(`PATCH /doctors/${req.params.id}`);
        Doctor.findByIdAndUpdate(req.params.id,req.body)
        .then(doc => {
            if(doc==null){
                res.status(404).send({message:"id not found"});
            }
            else{
                Doctor.findById(req.params.id)
                .then(doc2=>{res.status(200).send(doc2);});
                
            }
        },
        err => {res.status(404).send({message:"id not found"});}
        );
    })
    .delete((req, res) => {
        console.log(`DELETE /doctors/${req.params.id}`);
        Doctor.findByIdAndDelete(req.params.id)
        .then(doc => {
            if(doc==null){
                res.status(404).send({message:"id not found"});
            }
            else{
                res.status(200).send();
            }
        },
        err => {res.status(404).send({message:"id not found"});}
        );
    });
    
router.route("/doctors/:id/companions")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/companions`);
        
        Doctor.findById(req.params.id)
        .then(doc => {
            if(doc==null){
                res.status(404).send({message:"id not found"});
            }
            else{
                Companion.find({"doctors": { $in: req.params.id }})
                .then(comps=> {res.status(200).send(comps);});
            
            }
        },
        err => {res.status(404).send({message:"id not found"});}
        );
        
        
    });
    

router.route("/doctors/:id/goodparent")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/goodparent`);
        Doctor.findById(req.params.id)
        .then(doc => {
            if(doc==null){
                res.status(404).send({message:"id not found"});
            }
            else{
                Companion.find({"doctors": { $in: req.params.id }})
                .then(comps=> {res.status(200).send(comps.every(comp2=>comp2.alive));});
            
            }
        },
        err => {res.status(404).send({message:"id not found"});}
        );
    });

// optional:
router.route("/doctors/favorites/:doctor_id")
    .delete((req, res) => {
        console.log(`DELETE /doctors/favorites/${req.params.doctor_id}`);
        FavoriteDoctor.findOneAndDelete({"doctor": req.params.doctor_id})
        .then(doc => {
            if(doc==null){
                res.status(404).send({message:"id not found"});
            }
            else{
                res.status(200).send();
            }
        },
        err => {res.status(404).send({message:"id not found"});}
        );
    });

router.route("/companions")
    .get((req, res) => {
        console.log("GET /companions");
        // already implemented:
        Companion.find({}).sort('ordering')
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /companions");
        if(!req.body.name||!req.body.character||!req.body.seasons||!req.body.doctors||req.body.alive==null){
            res.status(500).send({message:"needs name or seasons"});
        }
        else{
            Companion.create(req.body).save()
            .then(comp => {
                res.status(201).send(comp);
            })
            
        }
    });

router.route("/companions/crossover")
    .get((req, res) => {
        console.log(`GET /companions/crossover`);
        Companion.find({})
            .then(comp => {
                res.status(200).send(comp.filter(comp => comp.doctors.length>1));
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });

// optional:
router.route("/companions/favorites")
    .get((req, res) => {
        console.log(`GET /companions/favorites`);
        FavoriteCompanion.find({})
        .then(favs => {
            if(favs==null){
                res.status(500).send({message:"id not found"});
            }
            else{
                Companion.find({ _id: favs.map(fav=>fav.companion) })
                .then(comps=>{res.status(200).send(comps)})
               
            
            }
        },
        err => {res.status(500).send({message:"id not found"});}
        );
    })
    .post((req, res) => {
        console.log(`POST /companions/favorites`);
        Companion.findById(req.body.companion_id)
        .then(comp => {
            if(comp==null){
                
                res.status(500).send({message:"id not found"});
            }
            else{
                FavoriteCompanion.find({"companion":  req.body.companion_id })
                .then(fcomp => {
                    if(fcomp.length>0){
                        
                        res.status(500).send({message:"already exist"});
                    }
                    else{
                       
                        
                        FavoriteCompanion.create(req.body.companion_id).save()
                        .then(comp2 => {
                             res.status(201).send(comp);
                        })
                    }
                })
                
            }
        },
        err => {res.status(500).send({message:"id not found"});}
        );
    })

router.route("/companions/:id")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}`);
        Companion.findById(req.params.id)
        .then(comp => {
            if(comp==null){
                res.status(404).send({message:"id not found"});
            }
            else{
                res.status(200).send(comp);
            }
        },
        err => {res.status(404).send({message:"id not found"});}
        );
    })
    .patch((req, res) => {
        console.log(`PATCH /companions/${req.params.id}`);
        Companion.findByIdAndUpdate(req.params.id,req.body)
        .then(comp => {
            if(comp==null){
                res.status(404).send({message:"id not found"});
            }
            else{
                Companion.findById(req.params.id)
                .then(comp2=>{res.status(200).send(comp2);});
                
            }
        },
        err => {res.status(404).send({message:"id not found"});}
        );
    })
    .delete((req, res) => {
        console.log(`DELETE /companions/${req.params.id}`);
        Companion.findByIdAndDelete(req.params.id)
        .then(comp => {
            if(comp==null){
                res.status(404).send({message:"id not found"});
            }
            else{
                res.status(200).send();
            }
        },
        err => {res.status(404).send({message:"id not found"});}
        );
    });

router.route("/companions/:id/doctors")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/doctors`);
        Companion.findById(req.params.id)
        .then(comp => {
            if(comp==null){
                res.status(404).send({message:"id not found"});
            }
            else{
                Doctor.find({ _id: comp.doctors })
                .then(docs=>{res.status(200).send(docs)})
               
            
            }
        },
        err => {res.status(404).send({message:"id not found"});}
        );
        
    });

router.route("/companions/:id/friends")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/friends`);
        Companion.findById(req.params.id)
        .then(comp => {
            if(comp==null){
                res.status(404).send({message:"id not found"});
            }
            else{
                Companion.find({ "seasons": {$in: comp.seasons} })
                .then(comps=>{res.status(200).send(comps.filter(c=>{return c.name!=comp.name;}))})
               
            
            }
        },
        err => {res.status(404).send({message:"id not found"});}
        );
    });

// optional:
router.route("/companions/favorites/:companion_id")
    .delete((req, res) => {
        console.log(`DELETE /companions/favorites/${req.params.companion_id}`);
        FavoriteCompanion.findOneAndDelete({"companion": req.params.companion_id})
        .then(comp => {
            if(comp==null){
                res.status(404).send({message:"id not found"});
            }
            else{
                res.status(200).send();
            }
        },
        err => {res.status(404).send({message:"id not found"});}
        );
    });

module.exports = router;