const broker =
"wss://broker.emqx.io:8084/mqtt";


const client = mqtt.connect(broker);



const topicTemp =
"otakai/home/temperature";

const topicHum =
"otakai/home/humidity";

const topicLed =
"otakai/home/led";

const topicStatus =
"otakai/home/status";



// =================
// Grafik
// =================


let tempData=[];

let humData=[];

let labels=[];



const tempChart =
new Chart(
document.getElementById("tempChart"),
{

type:"line",

data:{

labels:labels,

datasets:[{

label:"Suhu °C",

data:tempData

}]

}

});



const humChart =
new Chart(
document.getElementById("humChart"),
{

type:"line",

data:{

labels:labels,

datasets:[{

label:"Kelembapan %",

data:humData

}]

}

});





// =================
// MQTT Connected
// =================


client.on("connect",()=>{


console.log("MQTT Connected");


let status =
document.getElementById("mqttStatus");


status.innerHTML="🟢 MQTT Connected";


status.className="status connected";



client.subscribe(topicTemp);

client.subscribe(topicHum);

client.subscribe(topicStatus);



});




// =================
// MQTT Message
// =================


client.on("message",(topic,message)=>{


message =
message.toString();



let waktu =
new Date()
.toLocaleTimeString();



document.getElementById("time")
.innerHTML=waktu;



if(topic===topicTemp){


document.getElementById("temp")
.innerHTML=message+" °C";


labels.push(waktu);

tempData.push(Number(message));


if(labels.length>10){

labels.shift();

tempData.shift();

}


tempChart.update();


}



if(topic===topicHum){


document.getElementById("hum")
.innerHTML=message+" %";


humData.push(Number(message));


if(humData.length>10){

humData.shift();

}


humChart.update();


}



if(topic===topicStatus){


document.getElementById("lampStatus")
.innerHTML=message;


}



});




// =================
// Kontrol Lampu
// =================


function lampOn(){

client.publish(topicLed,"ON");

}



function lampOff(){

client.publish(topicLed,"OFF");

}