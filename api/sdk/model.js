const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // i & r
    x1 = (data[0] - 83) / 8.48528137423857
    x2 = (data[1] - 27) / 1.4142135623731
    x3 = (data[2] - 26) / 4.24264068711928
    x4 = (data[3] - 544) / 11.3137084989848
    return [x1, x2, x3, x4]
}

function denormalized(data){
    y1 = (data[0] * 57873) + 6577.50727859727
    y2 = (data[1] * 10160) + 342.239682094289
    y3 = (data[2] * 91.2219251595535) + 6.09267924394864
    y4 = (data[3] * 2235) + 111.722871427475
    y5 = (data[4] * 2140) + 131.521861300698
    y6 = (data[5] * 705) + 151.320851173921
    return [y1, y2, y3, y4, y5, y6]
}


async function predict(data){
    let in_dim = 4;
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/limid404/jst-remidi/main/api/sdk/model/model.json';
        const model = await tf.loadGraphModel(path);
        
        predict = model.predict(
                tf_data
        );
        result = predict.dataSync();
        return denormalized( result );
        
    }catch(e){
      console.log(e);
    }
}

module.exports = {
    predict: predict 
}
