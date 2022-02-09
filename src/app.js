const express = require('express');
const cluster = require('cluster');
const os = require( 'os' );

const app = express();

const numCPU = os.cpus().length

app.use('/', (req , res) => {
    
    const response = isPrime(req.query.number);
    
    
    res.json({
        message : response,
        From: process.pid
    })
    // process.exit()
})

if( cluster.isMaster ){
    for(let i = 0; i < numCPU; i++){
        cluster.fork()
    }
    
    cluster.on('exit', (worker, error, signal) => {
        console.log(`Worker ${ worker.process.id } died`);
        cluster.fork()
    })

}else{
    app.listen(8000, () => console.log("Server is up and running with process id "+ process.pid))
}


function isPrime( number ){
    let startTime = new Date();
    let endTime = new Date();
    let isPrime = true;
    for(let i = 3; i < number; i++ ){
        if(number % i === 0){
            endTime = new Date();
            isPrime = false;
            break;
        }

        if( isPrime ) endTime = new Date();

    }
    return {
        "number"  : number,
        "isPrime" : isPrime,
        "time"   : endTime.getTime() - startTime.getTime()
    }
}