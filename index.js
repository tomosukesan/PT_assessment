//送信ボタンがおされたら「id」「age」「sex」をスプレッドシートへ

//stein
const store = new SteinStore(""); //Stein APIのURL
//日付
let today = new Date();

const showMessage = () => {
    let id = document.getElementById("id");
    let age = document.getElementById("age");
    //性別
    let gender = document.getElementsByName("gender");
    let len = gender.length;

    let outputId = id.value;
    let outputAge = age.value;
    let outputGender = "";

    //性別の出力
    for(let i=0; i<len; i++){
        if(gender.item(i).checked){
            outputGender = gender.item(i).value;
        }
    }
    document.getElementById("output-message").innerHTML = "ID : " + outputId + " Age: " + outputAge + " Gender: " + outputGender;
    //steinへ
    store.append("sheet1", [
        {
            id: outputId,
            age: outputAge,
            gender: outputGender,
            date: today
        }
    ]).then(res => {
        console.log(res);
    });

}