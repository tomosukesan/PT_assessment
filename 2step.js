//obniz
var obniz = new Obniz("0654-8623");
//stein
const store = new SteinStore("https://api.steinhq.com/v1/storages/6118698047873c2b733280d8");

let startDistance = 0;
let finishDistance = 0;
let numberOfDecimalPlace = 2;       //小数点以下

obniz.onconnect = async function () {
    /* ここにパーツライブラリのコードをコピペすれば他のパーツも動かせる */
    // Javascript Example
    var hcsr04 = obniz.wired("HC-SR04", { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
    let id = "";

    //テスト
    document.getElementById("test-button").onclick = async function(){
        let distance = await hcsr04.measureWait();
        document.getElementById("test-text").innerHTML = "distance " + (distance*0.001).toFixed(numberOfDecimalPlace) + " m";
    }
    //測定開始
    document.getElementById("start").onclick = async function(){
        id = document.getElementById("id");
        startDistance = await hcsr04.measureWait();
        console.log((startDistance * 0.001).toFixed(numberOfDecimalPlace));
    }
    //測定終了
    document.getElementById("finish").onclick = async function(){
        finishDistance = await hcsr04.measureWait();
        console.log((finishDistance * 0.001).toFixed(numberOfDecimalPlace));
        //結果出力
        let result = ((startDistance - finishDistance)*0.001).toFixed(numberOfDecimalPlace);
        document.getElementById("result").innerHTML = "結果：" + result + "m";
        //steinへ
        store.edit("sheet1", {
            search: {id: id.value},
            set: {step_m: result},
            limit: 1
            }
        ).then(res => {
            console.log(res);
        });
    }

}