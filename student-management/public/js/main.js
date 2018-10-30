function getData() {
    axios.get('http://10.41.177.61:3001/api/')
        .then(result => {
            console.log(result.data);
            $('#data').html(JSON.stringify(result.data));
        })
        .catch(err => {
            console.log(err);
        })
}
function postData() {
    data = {
        _id: $('#id').val(),
        name: $('#name').val(),
        score: $('#score').val(),
        studentID: $('#studentID').val()
    }
    axios.post('http://10.41.177.61:3001/api', data)
        .then(res => {
            alert('Create Success');
        })
        .catch(err => {
            console.log(err);
    })
}