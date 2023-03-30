all: start 

electron_src: webft8
	cp electron_* src/

webft8:
	cp -Rv ../webft8/web/* ./src/

start: electron_src
	yarn run start

make: electron_src
	yarn run make

pack: electron_src
	yarn run pack

dist_for_current_os: electron_src
	yarn run publish

.PHONY: dist
dist: electron_src dist_all

dist_all: dist_linux dist_windows dist_mac dist_mac_intel

dist_linux: electron_src
	yarn run dist_linux

dist_windows: electron_src
	yarn run dist_windows

dist_mac: electron_src
	yarn run dist_mac

dist_mac_intel: electron_src
	yarn run dist_mac_intel

guide:
	# npm init electron-app@latest webft8-desktop
	# yarn add electron-builder --dev

test_linux: scp_linux unpack_linux

scp_linux:
	scp ./dist/webft8-desktop-1.0.0.tar.gz rr@192.168.1.120:/home/rr/wf8/

unpack_linux:
	ssh rr@192.168.1.120 bash -c 'pwd && cd wf8/ && ls -lah && rm -rf webft8-desktop-1.0.0/ && tar -xf webft8-desktop-1.0.0.tar.gz'