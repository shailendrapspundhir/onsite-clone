#!/bin/bash
docker build -t onsite360-dev .
docker run -it --rm   -p 5432:5432   -p 6379:6379   -p 9200:9200   -p 9300:9300   -p 3001:3001   -p 3002:3002   -p 3003:3003   -p 3004:3004   -p 3005:3005   -p 3006:3006   onsite360-dev