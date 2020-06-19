import json
from flask import Flask, render_template, request, jsonify, make_response
from werkzeug import secure_filename

import cv2
import pickle
import os
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV, KFold

app = Flask(__name__)


def imageExtractor(path):
    allFiles = os.listdir('students')
    allDirs = [item for item in allFiles if os.path.isdir('students/' + item)]
    videos = os.listdir(path)
    for item in videos:
        roll = item.split('.')[0]
        cam = cv2.VideoCapture(path+'/' + item)
        if not os.path.exists('students/' + roll):
            os.mkdir('students/'+roll)
        sample = 0
        #fps = cam.get(cv2.CAP_PROP_FPS)
        # print(fps)
        cv2.namedWindow('testing', cv2.WINDOW_NORMAL)

        while True and sample < 400:
            frame_flag, frame = cam.read()
            if frame_flag:
                # sample+=1
                # Rotating image
                #frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)

                # Changing image to Gray Scale
                gray_frame = gray_scale(frame)

                # Positions of Faces in the Frame
                faceCoordinates = detect_face(gray_frame)

                # Processing done on Image of Faces
                if len(faceCoordinates):
                    faces = processing_faces(gray_frame, faceCoordinates)

                    # Saving Processed Faces in memory
                    for face in faces:
                        sample += 1
                        cv2.imwrite('students/' + roll + '/' +
                                    str(sample) + '.jpg', face)
                        print('students/' + roll + '/' + str(sample) + '.jpg')

                # Show Rectangle around the face
                #draw_rectangle(frame, faceCoordinates)
                #cv2.imshow('testing', frame)

                if cv2.waitKey(30) == ord('q'):
                    break
            else:
                break
        cam.release()
        cv2.destroyAllWindows()


def gray_scale(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return gray_image


def detect_face(image):
    detector = cv2.CascadeClassifier("xml/frontal_face.xml")
    faces = detector.detectMultiScale(image, 1.2)
    return faces


def cut_faces(image, faces_coord):
    faces = []
    for (x, y, w, h) in faces_coord:
        faces.append(image[y: y + h, x: x + w])
    return faces


def normalize_intensity(images):
    images_norm = []
    for image in images:
        images_norm.append(cv2.equalizeHist(image))
    return images_norm


def resize(images, size=(47, 62)):
    image_resize = []
    for image in images:
        img_size = cv2.resize(image, size)
        image_resize.append(img_size)
    return image_resize


def processing_faces(image, faces_coord):
    simple_faces = cut_faces(image, faces_coord)
    norm_faces = normalize_intensity(simple_faces)
    final_faces = resize(norm_faces)
    return final_faces


def draw_rectangle(image, coords):
    for (x, y, w, h) in coords:
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 2)


def collect_dataset():
    frames = []
    labels = []
    labels_dic = {}

    people = [person for person in os.listdir("students/")]

    for i, person in enumerate(people):
        labels_dic[i] = person
        for frame in os.listdir("students/" + person):
            if frame.endswith('.jpg'):
                frames.append(cv2.imread(
                    "students/" + person + '/' + frame, 0))
                labels.append(i)
    return (frames, np.array(labels), labels_dic)


def modelTrainer():
    frames, labels, labels_dic = collect_dataset()
    X_train = np.asarray(frames)
    train = X_train.reshape(len(X_train), -1)

    sc = StandardScaler()
    X_train_sc = sc.fit_transform(train.astype(np.float64))

    pca = PCA(n_components=.97)
    train_data = pca.fit_transform(X_train_sc)

    kf = KFold(n_splits=5, shuffle=True)
    param = {'C': [.001, .01, .1, 1, 10]}

    gd = GridSearchCV(LogisticRegression(), param_grid=param,
                      cv=kf, scoring='accuracy')

    gd.fit(train_data, labels)
    model = gd.best_estimator_

    f = open('face_model.pkl', 'wb')
    pickle.dump(model, f)
    f.close()

    f = open('pca.pkl', 'wb')
    pickle.dump(pca, f)
    f.close()

    f = open('standardscalar.pkl', 'wb')
    pickle.dump(sc, f)
    f.close()

    return True


def predict():
    result = []
    images, labels, labels_dic = collect_dataset()

    model = pickle.load(open('face_model.pkl', 'rb'))
    pca = pickle.load(open('pca.pkl', 'rb'))
    sc = pickle.load(open('standardscalar.pkl', 'rb'))

    frame = cv2.imread('predict/test.png', 0)
    # print(frame)
    #cv2.namedWindow('testing', cv2.WINDOW_NORMAL)
    #cv2.imshow('testing', frame)
    # cv2.waitKey(0)
    # print(1)
    #gray_frame = gray_scale(frame)
    # print(0)

    faceCoordinates = detect_face(frame)
    print(faceCoordinates)
    if len(faceCoordinates):
        faces = processing_faces(frame, faceCoordinates)

        for i, face in enumerate(faces):  # for each detected face
            t = face.reshape(1, -1)

            t = sc.transform(t.astype(np.float64))
            test = pca.transform(t)

            prob = model.predict_proba(test)
            confidence = model.decision_function(test)

            prediction = model.predict(test)
            name = labels_dic[prediction[0]
                              ] if prob[0][prediction[0]] > 0.65 else 'Unknown'
            result.append(name)
            print(name)
            print(prob)
    return result


@app.route('/video/upload', methods=['GET', 'POST'])
def video_file():
    if request.method == 'POST':
        # request.headers['Access-Control-Allow-Origin'] = '*'
        f = request.files['file']
        print(request)
        print(f.filename)
        f.save("files/videos/"+secure_filename(f.filename))

        imageExtractor("files/videos")
        modelTrainer()

        # response = jsonify({"order_id": 123, "status": "shipped"})
        # response.headers.add("Access-Control-Allow-Origin", "*")
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response


@app.route('/predict', methods=['GET', 'POST'])
def predict_photo():
    if request.method == 'POST':
        # request.headers['Access-Control-Allow-Origin'] = '*'
        f = request.files['file']
        print(request)
        print(f.filename)
        f.save("predict/test.png")
        result = predict()
        # response = jsonify({"order_id": 123, "status": "shipped"})
        # response.headers.add("Access-Control-Allow-Origin", "*")
        data = {"result": result}
        response = make_response(jsonify(data))

        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response


@app.route('/attend/session', methods=['GET', 'POST'])
def attend_session():
    if request.method == 'POST':
        f = request.files['file']
        # print(request.content)
        f.save("files/attendance/"+secure_filename("test.png"))
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response


if __name__ == '__main__':

    app.run(debug=True)
