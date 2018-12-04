#!/bin/sh
while [[ true ]]; do
	curl --data "username=thisisahack&score=99999999999&grid={}" https://gameserver2048.herokuapp.com/submit
done