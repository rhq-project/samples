library("RCurl")
library("rjson")

## get data for user rhqadmin and schedule 10013
json_file <- getURL("http://localhost:7080/rest/1/metric/data/10013", httpheader=c(Accept = "application/json"),userpwd="rhqadmin:rhqadmin") 
## convert json to list of vectors
json_data <- fromJSON(paste(json_file, collapse=""))


## convert the embedded data points into a data frame
df <- data.frame(do.call(rbind,json_data$dataPoints))

## convert timestamps to date expressions in the whole list for the y axis
times <- lapply(df$timeStamp, function(x) {format(as.POSIXlt(round(x/1000),origin="1970-01-01"),"%H:%M")})

## plot the data -- type=p means points only, no connection lines.
plot(df$timeStamp,df$value,xlab="time",ylab="Free memory (bytes)",xaxt='n',type='p')
## and the labels on the x-axis
axis(1,df$timeStamp,times)
## Plot high, low, value 
## points() does not erase the original graph unlike plot()
points(df$timeStamp,df$low,col="green")
points(df$timeStamp,df$high,col="red")
points(df$timeStamp,df$value,col="black")

## Turn data series into vectors and plot the vertical bars
s <- seq(length(df$timeStamp))
tstv <- as.vector(mode="numeric",df$timeStamp)
lowv <- as.vector(mode="numeric",df$low)
higv <- as.vector(mode="numeric",df$high)
segments(tstv[s], lowv[s],tstv[s],higv[s],col="grey")

## translate values into a numeric vector to run some analysis on
g<-as.vector(mode="numeric",df$value)

## remove NaN values
h<-g[!is.na(g)]

## mean() is the same as json_data$avg
## Plot line for the avg value
abline(h=mean(h), col="blue")

