require 'rest_client'
require 'JSON'
load 'RHQ_config.rb'
load 'RHQ_util.rb'

rhq_config = RHQ_config.new('rhqadmin', 'rhqadmin')

base_url = rhq_config.base_url

start_url = 'resource/platforms'

RestClient.log = 'stdout'

should_finish = false
print 'Url to call ' + base_url + start_url + ".json\n\n"
response = RestClient.get base_url + start_url + '.json'
saved_response = response


def handle_links(links)
  i = 0
  link_list = []

  return link_list if links.nil? || links.empty?

  links.each do | pair |
    rel = pair[0]
    href = pair[1]
    meth = case rel
      when 'delete'
        'DELETE'
      when 'cancel'
        'DELETE' # TODO handling after delete - where to jump to?
      when 'update'
        'PUT'
      when 'create'
        'POST'
      when 'edit'
        # edit is GET, PUT, DELETE - fake the latter 2 and then
        # let the normal code do the GET
        print i.to_s + ') '+ rel  + ': ' + href + " (edit)\n"
        item = {:rel => rel, :href => href, :meth => 'PUT'}
        link_list.push(item)
        i+=1

        print i.to_s + ') '+ rel  + ': ' + href + " (delete/cancel)\n"
        item = {:rel => rel, :href => href, :meth => 'DELETE'}
        link_list.push(item)
        i+=1

        'GET'
      else
        'GET'
    end
    print i.to_s + ') '+ rel  + ': ' + href + " (" + meth +")\n"
    item = {:rel => rel, :href => href, :meth => meth}
    link_list.push(item)
    i+=1
  end
  link_list
end

def print_resource(obj)
  obj.each do |key,value|
      print '   ' + key +':' +value.to_s + "\n" if key != 'links'
  end

end

def select_single_resource(data)
  i= 0

  data.each do |inner|
    print i.to_s + ") \n"
    print_resource(inner)
    i += 1
  end

  print '==> '
  inp = gets
  inp = inp.strip
  data[Integer(inp)]

end


######## main loop
until should_finish
  print 'Response code ' + response.code.to_s + ", " + RestClient::STATUSES[response.code] + "\n"

  if response.code != 200
    response = saved_response
  end

  data = JSON.parse(response)

  link_list = []

  if data.kind_of?(Array)
    # link_list.concat(select_single_resource(data,links))
    res = select_single_resource(data)
    links = RHQ_util.get_links(response, res)
    link_list.concat(handle_links(links))
  else
    print_resource(data)
    links = RHQ_util.get_links(response, data)
    link_list.concat(handle_links(links))
  end


  print "q) quit \n"
  print "b) back \n"
  print '==> '

  inp = gets
  inp = inp.strip

  if inp=='q'
    should_finish = true
  elsif inp=='b'
    response = saved_response
  elsif inp != ''
    item = link_list[Integer(inp)]
    url = item[:href]
    method = item[:meth]
    saved_response = response

    resource=''
    if method == 'PUT'
      File.open('/tmp/rhq-rest-fu', 'w') { |f| f.write(response) } # TODO Don't write the links'

      #system("/bin/vi", "/tmp/rhq-rest-fu")
      print '= Now edit /tmp/rhq-rest-fu and then press return here ==>'
      gets

      # TODO shall we set the state to 'ready'?

    end

    print 'Getting ' + url.to_s + ' with method ' + method.to_s + "\n"
    if method == 'PUT'
      request = RestClient::Request.new(:method => method, ##  allow for other methods8
                                        :url => url,
                                        :user => rhq_config.user,
                                        :password => rhq_config.password,
                                        :headers => {:accept => :json, :content_type => :json},
                                        :payload => File.new("/tmp/rhq-rest-fu")
      )
    else
      request = RestClient::Request.new(:method => method, ##  allow for other methods8
                                        :url => url,
                                        :user => rhq_config.user,
                                        :password => rhq_config.password,
                                        :headers => {:accept => :json, :content_type => :json})

    end
    response = request.execute

    if response.code >399
      response=saved_response
      print "Got error #{response.code} \n"
    end
  end
end

