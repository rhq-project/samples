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