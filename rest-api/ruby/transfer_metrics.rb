#
# Example to transfer metrics out of RHQ and into RHQ-Metrics
#
# Author: Heiko W. Rupp

require 'rest_client'
require 'JSON'
load 'RHQconfig.rb'



# id of the schedule of the metric to transfer
schedule_id = 10007

# time range [ now - duration, now ] - default 1 day
duration = 1 * 24 * 3600 # seconds

# url of the rhq-metrics server to use
rhqm_url = 'http://10.3.10.81:8080/rhq-metrics/metrics'

config = RHQConfig.new("rhqadmin","rhqadmin")

#####

source = "Metric_#{schedule_id}"

base_url = config.base_url

end_time = Time::now.to_i
start_time = end_time - 1000 * duration
response = RestClient.get base_url + "metric/data/#{schedule_id}/raw.json?start=#{start_time}&end=#{end_time}"

data = JSON.parse(response)

outgoing = []

data.each do |item|
  print item['timeStamp'].to_s + ' => ' + item['value'].to_s + "\n"

  simple_metric = {:id => source, :value => item['value'], :timestamp => item['timeStamp']}

  outgoing.push(simple_metric)

end

json_data = JSON.generate(outgoing)

rhqm_request = RestClient::Request.new(
        :method => 'POST',
        :url => rhqm_url,
        :headers => { :accept => :json, :content_type => :json},
        :payload => json_data
)

rhqm_response = rhqm_request.execute

print rhqm_response