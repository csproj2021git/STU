import cv2
import base64
import os
import numpy as np
from flask import Flask
from flask import jsonify
from flask import request
import json

app = Flask(__name__)

eye_cascPath = 'D:\Chrome Downloads\project open eye\Closed-Eye-Detection-with-opencv-master/haarcascade_eye_tree_eyeglasses.xml'  #eye detect model
eye_cascPath2 = 'D:\Chrome Downloads\project open eye\Closed-Eye-Detection-with-opencv-master/haarcascade_eye.xml' #
face_cascPath = 'D:\Chrome Downloads\project open eye\Closed-Eye-Detection-with-opencv-master/haarcascade_frontalface_alt.xml'  #face detect model
faceCascade = cv2.CascadeClassifier(face_cascPath)
eyeCascade = cv2.CascadeClassifier(eye_cascPath)

def data_uri_to_cv2_img(uri):
    # Decodes DataURI (in 64bit) to image data, which is used by OpenCV
    encoded_data = uri.split(',')[1]
    nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

def detect(imageDataURL64):
    # Detect face, followed by detecting eyes in the image
    img = data_uri_to_cv2_img(imageDataURL64)
    if img.any():
        frame = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Detect faces in the image
        faces = faceCascade.detectMultiScale(
            frame,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30), # minSize=(30, 30),
            ## flags = cv2.CV_HAAR_SCALE_IMAGE # What for?
        )
        if len(faces) > 0:
            return find_eyes(frame, faces)
        ## print("Found {0} faces!".format(len(faces)))
        #
        # if len(faces) > 0:
        #     print("Number of faces is", len(faces))
        #     ## Draw a rectangle around the faces
        #     ## for (x, y, w, h) in faces:
        #     ##     cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
        #     # frame_tmp = img[faces[0][1]:faces[0][1] + faces[0][3], faces[0][0]:faces[0][0] + faces[0][2]:1, :]
        #     frame = frame[faces[0][1]:faces[0][1] + faces[0][3], faces[0][0]:faces[0][0] + faces[0][2]:1]
        #     # Detect eyes in the image
        #     eyes = eyeCascade.detectMultiScale(
        #         frame,
        #         scaleFactor=1.1,
        #         minNeighbors=5,
        #         minSize=(20, 20), # minSize=(30, 30),
        #         # flags = cv2.CV_HAAR_SCALE_IMAGE
        #     )
        #     print(eyes) #
        #     # print(frame.shape)
        #     # frame_tmp = frame[eyes[0][1]:eyes[0][1] + eyes[0][3], eyes[0][0]:eyes[0][0] + eyes[0][2]:1, :]
        #     threshold = 0.5 * frame.shape[0]
        #     for idx, eye in enumerate(eyes):
        #         if eye[1] > threshold:
        #             eyes = np.delete(eyes, idx, axis=0)
        #     print(eyes)  #
        #     if len(eyes) == 0:
        #         print('no eyes!!!')
        #         return False  # Student is not detected and possibly not positioned in front of camera
        #     else:
        #         print('eyes!!!')
        #         print(len(eyes))
        #         # frame_tmp = cv2.resize(frame_tmp, (400, 400), interpolation=cv2.INTER_LINEAR)
        #         ## cv2.imshow('Face Recognition', frame)
        #         ## while True:
        #         ##     waitkey = cv2.waitKey(1)
        #         ##     if waitkey == ord('q') or waitkey == ord('Q'):
        #         ##         cv2.destroyAllWindows()
        #         ##         break
        #         return True  # Student is detected and positioned in front of camera
        #
        else:
            print('no eyes at first.')
            # rotate face.
            rows, columns = frame.shape
            R1 = cv2.getRotationMatrix2D((columns / 2, rows / 2), 20, 1)
            R2 = cv2.getRotationMatrix2D((columns / 2, rows / 2), -20, 1)
            frame1 = cv2.warpAffine(frame, R1, (columns, rows))
            frame2 = cv2.warpAffine(frame, R2, (columns, rows))

            faces = faceCascade.detectMultiScale(
                frame1,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30),  # minSize=(30, 30),
                ## flags = cv2.CV_HAAR_SCALE_IMAGE # What for?
            )
            if len(faces) > 0:
                print('found in +15')
                return find_eyes(frame1, faces)

            faces = faceCascade.detectMultiScale(
                frame2,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30),  # minSize=(30, 30),
                ## flags = cv2.CV_HAAR_SCALE_IMAGE # What for?
            )
            if len(faces) > 0:
                print('found in -15')
                return find_eyes(frame2, faces)

            print('no eyes at all')
            return False  # No face detected - not looking at class / camera
            # frame_tmp = cv2.resize(frame_tmp, (400, 400), interpolation=cv2.INTER_LINEAR)
            # cv2.imshow('Face Recognition', frame)
    # while True:
    #     waitkey = cv2.waitKey(1)
    #     if waitkey == ord('q') or waitkey == ord('Q'):
    #         cv2.destroyAllWindows()
    #         break

def find_eyes(frame, faces):
    frame = frame[faces[0][1]:faces[0][1] + faces[0][3], faces[0][0]:faces[0][0] + faces[0][2]:1]
    # Detect eyes in the image
    eyes = eyeCascade.detectMultiScale(
        frame,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(20, 20),  # minSize=(30, 30),
        # flags = cv2.CV_HAAR_SCALE_IMAGE
    )
    print(eyes)  #
    # print(frame.shape)
    # frame_tmp = frame[eyes[0][1]:eyes[0][1] + eyes[0][3], eyes[0][0]:eyes[0][0] + eyes[0][2]:1, :]
    threshold = 0.5 * frame.shape[0]
    for idx, eye in enumerate(eyes):
        if eye[1] > threshold:
            eyes = np.delete(eyes, idx, axis=0)
    print(eyes)  #
    if len(eyes) == 0:
        print('no eyes!!!')
        return False  # Student is not detected and possibly not positioned in front of camera
    else:
        print('eyes!!!')
        print(len(eyes))
        # frame_tmp = cv2.resize(frame_tmp, (400, 400), interpolation=cv2.INTER_LINEAR)
        ## cv2.imshow('Face Recognition', frame)
        ## while True:
        ##     waitkey = cv2.waitKey(1)
        ##     if waitkey == ord('q') or waitkey == ord('Q'):
        ##         cv2.destroyAllWindows()
        ##         break
        return True  # Student is detected and positioned in front of camera


def detect_list(userIdImageDataList):
    res = []
    for tuple in userIdImageDataList:
        userId = tuple[0]
        imageData = tuple[1]
        res.append({userId: detect(imageData)})

@app.route('/', methods=['POST'])
def handler1():
    data = request.json
    return {'awake': detect(data['imgBase64']), 'userId': data['userId']}


app.run(port=5000)




