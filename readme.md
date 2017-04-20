##Stress test your mass email server

Spin up a new VPS.  Use a domain you have, or you can get a free one a www.dot.tk.  Point the mx records to your new server.

install nodejs + build tools + git (build tools may not be necessary but good to have)

```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
sudo apt-get install -y git
```


Then clone this repo onto your server
```
git clone https://github.com/dtruel/mass-email-tester.git
cd mass-email-tester
```

Then run it
```
node index.js
```

Now start sending email to any anything@yourdomain.com.

It will spit out total number of emails recieved, and average number of emails per minute.


