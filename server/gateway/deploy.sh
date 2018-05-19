#executes the build.sh script
./build.sh 
#goes in to secure shell of the droplet and excute the run.sh script
ssh root@api.milestoneapp.org 'bash -s' < run.sh