class RHQ_util

  require 'JSON'
  require 'rest_client'

  def self.get_metric_data_from_rhq(base_url, schedule_id, start_time, end_time, name)
    print "Transferring #{name} (#{schedule_id})\n"
    response = RestClient.get base_url + "metric/data/#{schedule_id}/raw.json?start=#{start_time}&end=#{end_time}"

    JSON.parse(response)
  end

  def self.get_schedule_for_id(base_url, schedule_id)
    response = RestClient.get base_url + "metric/schedule/#{schedule_id}.json"

    JSON.parse(response)
  end

end