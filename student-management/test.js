const axios = require('axios');
axios.default();

axios.get('http://10.41.177.61:3001/api')
    .then(res => {
        console.log(res);
    })
    .catch(err => console.log(err));


// axios.post('http://10.41.177.61:3001/api', {
//     _id: 9,
//     name: 'Nguyen Van Tan',
//     score: 10,
//     studentID: 16520087
// })
//     .then(res => {
//         console.log(res.data)
//     })
//     .catch(err => {
//         console.log(err.data)
//     });