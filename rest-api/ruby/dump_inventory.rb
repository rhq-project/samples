#
# Example to dump (parts of) the inventory of a RHQ server
#
# Author: Heiko W. Rupp

require 'rest_client'
require 'JSON'
load 'RHQconfig.rb'


config = RHQConfig.new("rhqadmin","rhqadmin")


def dump_resource(resource,level)
  {'resourceName' => 'name', 'resourceId' => 'id', 'typeName' => 'typ', 'availability' => 'availability'}.each {|key,name|
    do_indent(level)
    print name + ': ' + resource[key].to_s + "\n"
  }
  do_indent(level)
  print 'UI-Link: '
  print get_link(resource,'coregui')
  print "\n"
end


def get_link(resource,rel_name)

  link = nil

  links = resource['links']
  links.each do |x|
    if x.has_key?(rel_name)
      link = x[rel_name]['href']
    end
  end
  link
end

def do_indent(level)
  indent = 0...level
  indent.each do
    print '  '
  end
end

def dump_recursive(config, response, level)

  data = JSON.parse(response)
  data.each do |resource|
    dump_resource(resource,level)
    do_indent(level)
    print "--\n"


      if level == 0
        children = get_link(resource, 'children');
        if children != nil
          print 'Going for ' + children.to_s + "\n"

          request = RestClient::Request.new(
                  :method => 'GET',
                  :url => children,
                  :password => config.password,
                  :user => config.user,
                  :headers => { :accept => :json, :content_type => :json }
          )


          response = request.execute
          dump_recursive(config, response,level+1)
        end
      end
  end
end


base_url = config.base_url

response = RestClient.get base_url + 'resource/platforms.json'

dump_recursive(config, response,0)
