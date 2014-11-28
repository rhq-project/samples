#
# Sample script to read the status from the server and print on stdout
# Heiko W. Rupp
#

require 'rest_client'
require 'JSON'
load 'RHQ_config.rb'


config = RHQ_config.new('rhqadmin', 'rhqadmin')

base_url = config.base_url

response = RestClient.get base_url + 'status.json'

data = JSON.parse(response)

values = data['values']
values.each do |key,value|
 print key.to_s + ': ' +value.to_s + "\n"
end