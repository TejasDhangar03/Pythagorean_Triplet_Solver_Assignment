const express = require('express');
const path=require("path")
const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","temp1.html"))
})

app.post('/calculate-triangle', (req, res) => {
    const { ab, bc, ac } = req.body;

    if ([ab, bc, ac].some(v => isNaN(v) || v <= 0)) {
        return res.json({ result: null, isTriplet: null });
    }

    const secC = ac / bc;
    const cotA = ab / bc;
    const result = secC + cotA;
    const isTriplet = Math.abs(ac * ac - (ab * ab + bc * bc)) < 1e-6;

    res.json({
        secC: secC.toFixed(2),
        cotA: cotA.toFixed(2),
        result: Math.abs(result - 4/3) < 1e-9 ? '4 / 3' : result.toFixed(2),
        isTriplet
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
