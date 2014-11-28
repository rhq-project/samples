#
# Example to transfer metrics out of RHQ and into RHQ-Metrics
#
# Author: Heiko W. Rupp

require 'rest_client'
require 'JSON'
load 'RHQconfig.rb'
load 'RHQutil.rb'



# ids of the schedules of the metric to transfer
SCHEDULE_IDS = [ 10007 ,
              10005,
              10003 ]
SCHEDULE_PREFIX = 'RHQ'

# time range [ now - duration, now ] - default 1 day
duration = 1 * 24 * 3600 # seconds

# url of the rhq-metrics server to use
rhqm_url = 'http://10.3.10.81:8080/rhq-metrics/metrics'

config = RHQConfig.new('rhqadmin', 'rhqadmin')

#####





def generate_outgoing_batch(data, name)
  outgoing = []

  data.each do |item|

    simple_metric = {:id => name, :value => item['value'], :timestamp => item['timeStamp']}
    outgoing.push(simple_metric)

  end
  outgoing
end

def populate_schedules(base_url)
  SCHEDULE_IDS.each do |x|
    s = RHQ_util.get_schedule_for_id(base_url,x)
    SCHEDULES[x] = SCHEDULE_PREFIX + '.' + s['scheduleName']
  end
end



############### main ###########
SCHEDULES = {}

base_url = config.base_url

populate_schedules(base_url)

end_time = Time::now.to_i
start_time = end_time - 1000 * duration



SCHEDULES.each do |schedule_id,name|

  data = RHQ_util.get_metric_data_from_rhq(base_url, schedule_id, start_time, end_time, name)
  outgoing = generate_outgoing_batch(data, name)

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
