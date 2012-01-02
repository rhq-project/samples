library("RCurl")
library("rjson")

## get raw data for user rhqadmin and schedule 10013 for the last 86400sec (=24h)
json_file <- getURL("http://localhost:7080/rest/1/metric/data/10013/raw?duration=86400", httpheader=c(Accept = "application/json"),userpwd="rhqadmin:rhqadmin") 
## convert json to list of vectors
json_data <- fromJSON(paste(json_file, collapse=""))

options(digits=16)

## convert into a data frame
df <- data.frame(do.call(rbind,json_data))

## convert timestamps to date expressions in the whole list for the y axis
times <- lapply(df$timeStamp, function(x) {format(as.POSIXlt(round(x/1000),origin="1970-01-01"),"%H:%M")})

## plot the data 
plot(df$timeStamp,df$value,xlab="time",ylab="Free memory (bytes)",xaxt='n',type='b')
## and the labels on the x-axis
axis(1,df$timeStamp,times)

## translate values into a numeric vector to run some analysis on
g<-as.vector(mode="numeric",df$value)

## remove NaN values
h<-g[!is.na(g)]

## Plot line for the avg value
abline(h=mean(h), col="gray")

## Plot markers for 20% and 80% quantiles
abline(h=quantile(h,.20), col="lightblue")
abline(h=quantile(h,.80), col="lightgreen")

## compute and plot 20 items moving average requires library 'TTR'
libFound <- library("TTR", logical.return=TRUE)
if (libFound) {
  points(df$timeStamp,EMA(h,n=20),col="red",pch="-")
}
