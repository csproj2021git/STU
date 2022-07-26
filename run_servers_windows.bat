::  1) install python requirements :
cd awareness
pip install -r requirements.txt
start python cv_close_eye_detect.py
::  2) install classroom requirements & run classroom's server [port 3030] :
cd ..\classrooms
start npm run dev
:: 3) install Login requirements & run login's server and client [port 5000 & 5001 respectively]
cd ..\login\server
start npm run dev
cd ..\client_
start npm run dev
:: 4) install Moodle requirements & run Moodle's server and client [port 7000 & 7001 respectively]
cd ..\..\Moodle\server
start npm run dev
cd ..\client_
start npm run dev
:: 5) install Polls requirements & run Poll's server and client [port 4000 & 4001 respectively]
cd ..\..\Polls\server
start npm run dev
cd ..\client_
start npm run dev