
// POST solve
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
