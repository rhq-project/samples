##
# RHQ specific helper methods

class RHQ_util

  require 'JSON'
  require 'rest_client'

  ##
  # Fetches raw metric data from the RHQ server +base_url+ is the base url of the
  # rest api of the RHQ server. +schedule_id+ denotes the numeric id of the metric
  # to fetch. +name+ is only used for diagnostic printing and can be omitted.
  # +start_time+ and +end_time+ denote the desired time range
  #
  # The server will return a 406 status code if +start_time+ is before now - 7 days.

  def self.get_metric_data_from_rhq(base_url, schedule_id, start_time, end_time, name='-unset-')
    # passed time are time objects and to_i returns seconds since epoch.
    st = start_time.to_i * 1000
    et = end_time.to_i * 1000
    print "Transferring #{name} (#{schedule_id})\n"
    url = base_url + "metric/data/#{schedule_id}/raw.json?startTime=#{st}&endTime=#{et}"
    response = RestClient.get url

    JSON.parse(response)
  end

  ##
  # Return the schedule information for the passed +schedule_id+

  def self.get_schedule_for_id(base_url, schedule_id)
    response = RestClient.get base_url + "metric/schedule/#{schedule_id}.json"

    JSON.parse(response)
  end

  ##
  # Return all the links of the resource. This includes the (paging) links in the
  # header of the +response+ as well as the link elements inside the +resource+ itself.

  def self.get_links(response,resource)

    raise 'Only a single resource is supported' if resource.kind_of?(Array)

    raw_headers = response.raw_headers['link']
    links = get_header_links(raw_headers)

    resource_links = get_resource_links(resource)
    links.merge!(resource_links)

    links

  end

  def self.get_resource_links(resource)
    raise 'Only a single resource is supported' if resource.kind_of?(Array)

    tmp = resource['links']
    links = {}

    return links if tmp.nil?

    # We have an array of hashes (of hashes)
    tmp.each do |x|
      x.each{|key,value| links[key]=value['href']}
    end

    links
  end

  def self.get_link(resource,rel_name)

    links = get_resource_links(resource)
    link = links[rel_name]

    link
  end


  def self.get_header_links(raw_headers)

    # entries look like "<http://localhost:7080/rest/resource/platforms.json?page=-1>; rel=\"last\""

    return {} if raw_headers.nil?

    ret = {}

    raw_headers.each do |x|
      ret.merge!(split_link_header(x))
    end

    ret

  end

  def self.split_link_header(val)
    ret = {}
    # input is like <http://localhost:7080/rest/resource/platforms.json?page=-1>; rel=\"last\"
    entries = val.split(';')
    val = entries[0]
    val[0]='' # remove <
    val[-1]='' # remove >

    rel = entries[1]
    tmp = rel.split('=')
    key = tmp[1]
    # remove surrounding "
    key[0] = ''
    key[-1] = ''

    ret[key] = val

    ret
  end
end