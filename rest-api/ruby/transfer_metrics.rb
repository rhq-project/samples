#
# Example to transfer metrics out of RHQ and into RHQ-Metrics
#
# Author: Heiko W. Rupp

require 'rest_client'
require 'JSON'
load 'RHQconfig.rb'



# ids of the schedules of the metric to transfer + their display name
SCHEDULES = { 10007 => 'RHQ.snert.memory.free',
              10005 => 'RHQ.snert.memory.actualFree',
              10003 => 'RHQ.snert.cpu.user'}


# time range [ now - duration, now ] - default 1 day
duration = 1 * 24 * 3600 # seconds

# url of the rhq-metrics server to use
rhqm_url = 'http://10.3.10.81:8080/rhq-metrics/metrics'

config = RHQConfig.new('rhqadmin', 'rhqadmin')

#####



base_url = config.base_url

end_time = Time::now.to_i
start_time = end_time - 1000 * duration


SCHEDULES.each do |schedule_id,name|

  print "Transferring #{name} (#{schedule_id})\n"
  response = RestClient.get base_url + "metric/data/#{schedule_id}/raw.json?start=#{start_time}&end=#{end_time}"

  outgoing = []

  data = JSON.parse(response)
  data.each do |item|

    simple_metric = {:id => name, :value => item['value'], :timestamp => item['timeStamp']}
    outgoing.push(simple_metric)

  end

  print "   -> #{outgoing.size} items\n"

  json_data = JSON.generate(outgoing)

  rhqm_request = RestClient::Request.new(
          :method => 'POST',
          :url => rhqm_url,
          :headers => { :accept => :json, :content_type => :json},
          :payload => json_data
  )

  rhqm_response = rhqm_request.execute

  print "   <- #{RestClient::STATUSES[rhqm_response.code]} (#{rhqm_response.code})\n"

end
