# !ls /kaggle/input/drowsiness // Relevant for running on kaggle


# Dependencies :
import cv2, os
import numpy as np
import matplotlib.image as mpimg
import matplotlib.pyplot as plt
# %matplotlib inline // Relevant for running on kaggle
from matplotlib.image import imread
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import models, layers, Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator

from tensorflow.keras.applications import ResNet50
from keras.applications.resnet50 import preprocess_input
from keras.models import Sequential
from keras.layers import Dense

# Block_1

data_dir = '../input/drowsiness'

train_datagen = ImageDataGenerator(validation_split=0.2,
                                   preprocessing_function=preprocess_input) # don't use rescale = 1./255

train_generator = train_datagen.flow_from_directory( data_dir,
                                                     target_size=(80,80),
                                                     batch_size=100,
                                                     shuffle=True,
                                                     class_mode='categorical',
                                                     subset='training')

validation_datagen = ImageDataGenerator(validation_split=0.2,
                                        preprocessing_function=preprocess_input)

validation_generator = validation_datagen.flow_from_directory( data_dir,
                                                                target_size=(80,80),
                                                                batch_size=100,
                                                                class_mode='categorical',
                                                                subset='validation')

# Block_2

model_res50 = Sequential()

model_res50.add(ResNet50(
    input_shape=(80,80,3),
    include_top=False,
    pooling='avg',
    weights='imagenet'
    ))

model_res50.add(Dense(2, activation='softmax'))

model_res50.layers[0].trainable = False

model_res50.summary()


steps_per_epoch_training = len(train_generator)
steps_per_epoch_validation = len(validation_generator)


# Block_3

model_res50.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

history = model_res50.fit(
    train_generator,
    steps_per_epoch=steps_per_epoch_training,
    validation_steps=steps_per_epoch_validation,
    epochs=2,
    validation_data=validation_generator,
    verbose=1
)

# Block_4

%matplotlib inline

import matplotlib.image  as mpimg
import matplotlib.pyplot as plt

#-----------------------------------------------------------
# Retrieve a list of list results on training and test data
# sets for each training epoch
#-----------------------------------------------------------
acc=history.history['accuracy']
val_acc=history.history['val_accuracy']
loss=history.history['loss']
val_loss=history.history['val_loss']

epochs=range(len(acc)) # Get number of epochs

#------------------------------------------------
# Plot training and validation accuracy per epoch
#------------------------------------------------
plt.plot(epochs, acc, 'r', "Training Accuracy")
plt.plot(epochs, val_acc, 'b', "Validation Accuracy")
plt.title('Training and validation accuracy')
plt.figure()

#------------------------------------------------
# Plot training and validation loss per epoch
#------------------------------------------------
plt.plot(epochs, loss, 'r', "Training Loss")
plt.plot(epochs, val_loss, 'b', "Validation Loss")
plt.title('Training and validation loss')
plt.legend()

plt.show()

model_res50.save('elad_model.h5')

img_array = cv2.imread('../input/drowsiness/Opened/s0001_01845_0_0_1_0_0_01.png', cv2.IMREAD_GRAYSCALE)
backtorgb = cv2.cvtColor(img_array, cv2.COLOR_GRAY2BGR)
new_array = cv2.resize(backtorgb, (80, 80))
X_input = np.array(new_array).reshape(1, 80, 80, 3)
plt.imshow(img_array)
# prediction = model_res50.predict(X_input/255.0)
# print(prediction)
prediction = model_res50.predict(X_input)
print(prediction)

model_new = tf.keras.models.load_model("elad_model.h5")
img_array = cv2.imread('../input/drowsiness-detection/closed_eye/s0001_00012_0_0_0_0_0_01.png', cv2.IMREAD_GRAYSCALE)
backtorgb = cv2.cvtColor(img_array, cv2.COLOR_GRAY2BGR)
new_array = cv2.resize(backtorgb, (80, 80))
X_input = np.array(new_array).reshape(1, 80, 80, 3)
plt.imshow(new_array)
prediction = model_new.predict(X_input)
print(prediction)
