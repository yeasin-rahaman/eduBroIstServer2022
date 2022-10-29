const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const { cloudinary } = require("./Utility/Cloudinary");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpepp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpepp.mongodb.net/?retryWrites=true&w=majority`

// console.log('mogno:',uri);
const client = new MongoClient(uri, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("EduBro");
        const allQuestionsCollection = database.collection("allQuestions");
        const allAssignmentsCollection = database.collection("allAssignments");
        const allBooksCollection = database.collection("allBooks");
        const allSyllabusCollection = database.collection("allSyllabus");
        const allBlogsCollection = database.collection("allBlogs");
        const allNotesCollection = database.collection("allNotes");
        const allLabsCollection = database.collection("allLabs");
        const userCollection = database.collection("user");
        const reviewCollection = database.collection("review");
        const questionSolveCollection = database.collection("questionSolve");
        const assignmentSolveCollection = database.collection("assignmentSolve");
        const BlogCommentCollection = database.collection("BlogComment");



        // POST question solve
        app.post('/addQuestionSolve', async (req, res) => {
            const questionSolve = req.body;
            const result = await questionSolveCollection.insertOne(questionSolve);
            res.json(result);
            //console.log(result)

        });



        // get question  solve

        app.get('/questionSolve/:id', async (req, res) => {
            const result = await questionSolveCollection.find({ questionId: req.params.id }).toArray()
            res.send(result)
        })



        // POST Question
        app.post('/postQuestion', async (req, res) => {
            const allQuestions = req.body;
            const result = await allQuestionsCollection.insertOne(allQuestions);
            res.json(result);
            //console.log(result)

        });


        // Get all questions api 

        app.get("/allQuestions", async (req, res) => {
            // console.log(req.query)
            const search = req.query.search
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const query = req.query;
            query.status = "approved"
            delete query.page
            delete query.size
            delete query.search
            Object.keys(query).forEach(key => {
                if (!query[key])
                    delete query[key]
            });

            if (Object.keys(query).length) {
                // const cursor = allQuestionsCollection.find(query, status = "approved");
                console.log(query);
                const cursor = allQuestionsCollection.find(
                    {
                        ...query, $or: [
                            { subject: { $regex: search, $options: 'i' } },
                            { code: { $regex: search, $options: 'i' } },
                            { department: { $regex: search, $options: 'i' } },
                            { semester: { $regex: search, $options: 'i' } },
                            { year: { $regex: search, $options: 'i' } },
                            { userName: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                        ]
                    }
                );


                const count = await cursor.count()
                const allQuestions = await cursor.skip(page * size).limit(size).toArray()
                console.log(allQuestions);
                res.json({
                    allQuestions, count
                });

            } else {
                // const cursor = allQuestionsCollection.find({
                //     status: "approved"
                // });
                const cursor = allQuestionsCollection.find({
                    $or: [
                        { subject: { $regex: search, $options: 'i' } },
                        { code: { $regex: search, $options: 'i' } },
                        { department: { $regex: search, $options: 'i' } },
                        { semester: { $regex: search, $options: 'i' } },
                        { year: { $regex: search, $options: 'i' } },
                        { userName: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                    ]
                });
                const count = await cursor.count()
                const allQuestions = await cursor.skip(page * size).limit(size).toArray()

                res.json({
                    allQuestions, count
                });
            }

        });





        // get single questions
        app.get('/question/:id', async (req, res) => {
            const id = req.params.id;
            const result = await allQuestionsCollection.findOne({ _id: ObjectId(id) })
            res.json(result)
        })


        // Get all questions api 
        app.get("/getAllQuestions", async (req, res) => {
            const cursor = allQuestionsCollection.find({});
            const allQuestions = await cursor.toArray();
            res.json(allQuestions);
        });

        // question status update

        app.put("/QuestionStatusUpdate/:id", async (req, res) => {

            const filter = { _id: ObjectId(req.params.id) };

            const result = await allQuestionsCollection.updateOne(filter, {
                $set: {
                    status: req.body.status,
                },
            });
            res.send(result);
        });



        // POST Assignment solve
        app.post('/addAssignmentSolve', async (req, res) => {
            const assignmentSolve = req.body;
            const result = await assignmentSolveCollection.insertOne(assignmentSolve);
            res.json(result);
            //console.log(result)

        });



        // get assignment  solve

        app.get('/assignmentSolve/:id', async (req, res) => {
            const result = await assignmentSolveCollection.find({ assignmentId: req.params.id }).toArray()
            res.send(result)
        })



        // POST assignment
        app.post('/postAssignment', async (req, res) => {
            const allAssignments = req.body;
            const result = await allAssignmentsCollection.insertOne(allAssignments);
            res.json(result);
            //console.log(result)

        });


        // Get all Assignments api 

        app.get("/allAssignments", async (req, res) => {
            // console.log(req.query)
            const search = req.query.search
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const query = req.query;
            query.status = "approved"
            delete query.page
            delete query.size
            delete query.search
            Object.keys(query).forEach(key => {
                if (!query[key])
                    delete query[key]
            });

            if (Object.keys(query).length) {
                // const cursor = allAssignmentsCollection.find(query, status = "approved");
                console.log(query);
                const cursor = allAssignmentsCollection.find(
                    {
                        ...query, $or: [
                            { subject: { $regex: search, $options: 'i' } },
                            { code: { $regex: search, $options: 'i' } },
                            { department: { $regex: search, $options: 'i' } },
                            { semester: { $regex: search, $options: 'i' } },
                            { year: { $regex: search, $options: 'i' } },
                            { userName: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                        ]
                    }
                );


                const count = await cursor.count()
                const allAssignments = await cursor.skip(page * size).limit(size).toArray()
                console.log(allAssignments);
                res.json({
                    allAssignments, count
                });

            } else {
                // const cursor = allAssignmentsCollection.find({
                //     status: "approved"
                // });
                const cursor = allAssignmentsCollection.find({
                    $or: [
                        { subject: { $regex: search, $options: 'i' } },
                        { code: { $regex: search, $options: 'i' } },
                        { department: { $regex: search, $options: 'i' } },
                        { semester: { $regex: search, $options: 'i' } },
                        { year: { $regex: search, $options: 'i' } },
                        { userName: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                    ]
                });
                const count = await cursor.count()
                const allAssignments = await cursor.skip(page * size).limit(size).toArray()

                res.json({
                    allAssignments, count
                });
            }

        });





        // get single Assignments
        app.get('/assignment/:id', async (req, res) => {
            const id = req.params.id;
            const result = await allAssignmentsCollection.findOne({ _id: ObjectId(id) })
            res.json(result)
        })


        // Get all Assignments api 
        app.get("/getAllAssignments", async (req, res) => {
            const cursor = allAssignmentsCollection.find({});
            const allAssignments = await cursor.toArray();
            res.json(allAssignments);
        });

        // Assignment status update

        app.put("/AssignmentStatusUpdate/:id", async (req, res) => {

            const filter = { _id: ObjectId(req.params.id) };

            const result = await allAssignmentsCollection.updateOne(filter, {
                $set: {
                    status: req.body.status,
                },
            });
            res.send(result);
        });




        // Delete Assignments 
        app.delete('/deleteAssignment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allAssignmentsCollection.deleteOne(query);
            res.json(result);
        })



        // POST Books
        app.post('/postBooks', async (req, res) => {
            const allBooks = req.body;
            const result = await allBooksCollection.insertOne(allBooks);
            res.json(result);
            //console.log(result)

        });


        // Get all books api 
        app.get("/allBooks", async (req, res) => {
            const cursor = allBooksCollection.find({});
            const allBooks = await cursor.toArray();
            res.send(allBooks);
        });



        app.delete('/deleteBook/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allBooksCollection.deleteOne(query);
            res.json(result);


        })



        // POST syllabus
        app.post('/postSyllabus', async (req, res) => {
            const allSyllabus = req.body;
            const result = await allSyllabusCollection.insertOne(allSyllabus);
            res.json(result);

        });


        // Get all syllabus api 
        app.get("/allSyllabus", async (req, res) => {
            const cursor = allSyllabusCollection.find({});
            const allSyllabus = await cursor.toArray();
            res.send(allSyllabus);
        });


        // syllabus update status 
        app.put("/SyllabusStatusUpdate/:id", async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            const result = await allSyllabusCollection.updateOne(filter, {
                $set: {
                    status: req.body.status,
                },
            });
            res.send(result);
        });


        // Delete Syllabus
        app.delete('/deleteSyllabus/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allSyllabusCollection.deleteOne(query);
            res.json(result);
        })


        // get blog  comment 

        app.get('/getBlogComment', async (req, res) => {

            const result = await BlogCommentCollection.find({}).toArray()
            res.send(result)
        })



        // post blog comment 
        app.post('/PostBlogComment', async (req, res) => {
            const BlogComment = req.body;
            const result = await BlogCommentCollection.insertOne(BlogComment);
            res.json(result);
            //console.log(result)

        });


        // blog update status 

        app.put("/BookStatusUpdate/:id", async (req, res) => {

            const filter = { _id: ObjectId(req.params.id) };

            const result = await allBooksCollection.updateOne(filter, {
                $set: {
                    status: req.body.status,
                },
            });
            res.send(result);
        });




        //add user review
        app.post("/review", async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            console.log("review added", req.body);
            console.log("successfully added review", result);
            res.json(result);
        });

        //get all review
        app.get("/review", async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });





        //get all Labs
        app.get("/allLabs", async (req, res) => {

            const cursor = allLabsCollection.find({})
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let allLabs;
            const count = await cursor.count();
            if (page) {
                allLabs = await cursor.skip(page * size).limit(size).toArray()
            } else {
                allLabs = await cursor.toArray();
            }
            res.send({
                count,
                allLabs
            });
        });



        //post Labs
        app.post('/postLabs', async (req, res) => {
            const allLabs = req.body;
            const result = await allLabsCollection.insertOne(allLabs);
            res.json(result);
            //console.log(result)

        });


        app.get('/myLabs/:email', async (req, res) => {
            const result = await allLabsCollection.find({ email: req.params.email }).toArray()
            res.send(result)
        })

        app.delete('/deleteLab/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allLabsCollection.deleteOne(query);
            res.json(result);


        })



        // POST blogs
        app.post('/postBlogs', async (req, res) => {
            const blogInfo = req.body;
            const blogImg = blogInfo.blogImg;
            try {
                const response = await cloudinary.uploader.upload(blogImg, {
                    upload_preset: "Blogs"
                })
                console.log(response.url);
                blogInfo.blogImg = response.url;
                const result = await allBlogsCollection.insertOne(blogInfo);
                res.json(result);

            } catch (error) {
                console.log(error);
            }
            // console.log(blogInfo, "test");
            // const allBlogs = req.body;


        });


        // Get all blogs api 
        app.get("/allBlogs", async (req, res) => {
            const cursor = allBlogsCollection.find({});
            const allBlogs = await cursor.toArray();
            res.send(allBlogs);
        });


        app.delete('/deleteBlog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allBlogsCollection.deleteOne(query);
            res.json(result);


        })




        // get single blog
        app.get('/blog-details/:id', async (req, res) => {
            const id = req.params.id;

            const result = await allBlogsCollection.findOne({ _id: ObjectId(id) })
            res.json(result)
        })



        // blog update status 

        app.put("/BlogStatusUpdate/:id", async (req, res) => {

            const filter = { _id: ObjectId(req.params.id) };

            const result = await allBlogsCollection.updateOne(filter, {
                $set: {
                    status: req.body.status,
                },
            });
            res.send(result);
        });


        // POST notes
        app.post('/postNotes', async (req, res) => {
            const allNotes = req.body;
            const result = await allNotesCollection.insertOne(allNotes);
            res.json(result);
            //console.log(result)

        });

        // Get all notes api 
        app.get("/allNotes", async (req, res) => {
            const cursor = allNotesCollection.find({});
            const allNotes = await cursor.toArray();
            res.send(allNotes);
        });


        // blog update status 

        app.put("/notesStatusUpdate/:id", async (req, res) => {

            const filter = { _id: ObjectId(req.params.id) };

            const result = await allNotesCollection.updateOne(filter, {
                $set: {
                    status: req.body.status,
                },
            });
            res.send(result);
        });

        // Delete Note 
        app.delete('/deleteNote/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allNotesCollection.deleteOne(query);
            res.json(result);
        })


        // add user 
        app.post("/users", async (req, res) => {
            const result = await userCollection.insertOne(req.body);
            res.send(result);
            //console.log(result)
        });


        // upsert for google login 
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true }
            const updateDoc = { $set: user }
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })


        // update user
        app.put('/updateUser', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = {
                $set: {
                    department: user.department,
                    university: user.university
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc)
            res.json(result)
        })

        // get single user
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const user = await userCollection.findOne(query)
            res.json(user)
        })



        // get my note

        app.get('/myQuestions/:email', async (req, res) => {
            const result = await allQuestionsCollection.find({ email: req.params.email }).toArray()
            res.send(result)
        })


        // Delete questions 
        app.delete('/deleteQuestion/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allQuestionsCollection.deleteOne(query);
            res.json(result);
        })




        // // get my note

        app.get('/myNotes/:email', async (req, res) => {
            const result = await allNotesCollection.find({ email: req.params.email }).toArray()
            res.send(result)
        })


        // // get my Books

        app.get('/myBooks/:email', async (req, res) => {
            const result = await allBooksCollection.find({ email: req.params.email }).toArray()
            res.send(result)
        })
        // // get my syllabus

        app.get('/mySyllabus/:email', async (req, res) => {
            const result = await allSyllabusCollection.find({ email: req.params.email }).toArray()
            res.send(result)
        })


        // // get my blogs

        app.get('/myBlogs/:email', async (req, res) => {
            const result = await allBlogsCollection.find({ email: req.params.email }).toArray()
            res.send(result)
        })
        //MAKE ADMIN
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc)
            res.json(result)
        })

        //MAKE teacher
        app.put('/users/teacher', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'teacher' } };
            const result = await userCollection.updateOne(filter, updateDoc)
            res.json(result)
        })

        //ADMIN CONDITIONALLY RENDERED
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query)
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })





    } finally {
        // await client.close()
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Running The EduBro Server");
});


app.listen(port, () => {
    console.log("Running Server in Port", port);
});
