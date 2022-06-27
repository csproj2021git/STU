#!/bin/bash
cd awareness
python cv_close_eye_detect.py &
cd ../classrooms
node server.js &

