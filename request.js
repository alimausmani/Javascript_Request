const axios=require("axios");
const fs=require("fs");
const rs=require("readline-sync");
const getData=()=>{
  axios.get("https://api.merakilearn.org/courses")
    .then(response=>{
        var UserData=response.data;
        fs.writeFileSync("courses.json",JSON.stringify(UserData,null,4));
        // console.log(UserData)
        let p=1;
        for(let i of UserData){
          console.log(`${p} ${i["name"]} ${i["id"]}`)
          p++
        }
        const user=rs.question("Enter which programme do you want:");
        console.log(`${UserData[user-1]["name"]} : ${UserData[user-1]["id"]}`);
        const fileContent=UserData[user-1]["name"]+"_"+UserData[user-1]["id"];
        const link="https://api.merakilearn.org/courses/"+UserData[user-1]["id"]+"/exercises";
        axios.get(link)
            .then(exercise=>{
                const exerciseData=exercise.data;
                fs.writeFileSync(fileContent,JSON.stringify( exerciseData,null,4));
                let topicCount=1;
                for(let i of exerciseData["course"]["exercises"]){
                  console.log(`${topicCount} ${i["name"]}`)
                  topicCount++
                }
                const topic=rs.question("Enter topic number whichever you want:");
                let  topicIndex=topic-1;
                for (let i of exerciseData["course"]["exercises"][topicIndex]["content"]){
                  console.log(i["value"])
                }
                while(topicIndex<=(exerciseData["course"]["exercises"]).length){
                  const nextPerivious=rs.question("Whts do you want n/p:")
                  if(nextPerivious=="p"){
                    topicIndex=topicIndex-1;
                    if(1<=topicIndex || topicIndex==0){
                      console.log(exerciseData["course"]["exercises"][topicIndex]["name"])
                      for(let i of exerciseData["course"]["exercises"][topicIndex]["content"]){
                      console.log(i["value"])
                      }
                    }else{
                      console.log("Finished !")
                      break
                    }
                  }
                  else if(nextPerivious=="n"){
                    topicIndex++;
                    if(topicIndex<(exerciseData["course"]["exercises"]).length){
                      console.log(exerciseData["course"]["exercises"][topicIndex]["name"])
                      for (let i of exerciseData["course"]["exercises"][topicIndex]["content"]){
                        console.log(i["value"])
                      }
                    }else{
                      console.log("Topic Completed!")
                      break
                    }
                  }else{
                    console.log("Wrong Input!")
                    break
                  }
                }
              })
    })
}
const requestData=getData();
