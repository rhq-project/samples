require 'test/unit'
require File.dirname(__FILE__) + '/RHQ_util'

class MyTest < Test::Unit::TestCase

  # Called before every test method runs. Can be used
  # to set up fixture information.
  def setup
    # Do nothing
  end

  # Called after every test method runs. Can be used to tear
  # down fixture information.

  def teardown
    # Do nothing
  end

  # Fake test
  def test_split_link_header
    header = "<http://localhost:7080/rest/resource/platforms.json?page=-1>; rel=\"last\""

    ret = RHQ_util.split_link_header(header)

    assert ret!=nil?
    assert ret.size == 1
    assert ret['last']=='http://localhost:7080/rest/resource/platforms.json?page=-1'

  end

  def test_header_links
    raw_headers = ["<http://localhost:7080/rest/resource/platforms.json?page=-1>; rel=\"last\"",
                   "<http://localhost:7080/rest/resource/platforms.json>; rel=\"current\""]

    ret = RHQ_util.get_header_links(raw_headers)

    assert ret != nil?
    assert ret.size ==2 , "Expected 2 entries, but got #{ret.size}"
    assert ret['last'] != nil?
    assert ret['last'] == 'http://localhost:7080/rest/resource/platforms.json?page=-1'
    assert ret['current'] != nil?
    assert ret['current'] == 'http://localhost:7080/rest/resource/platforms.json'

  end

  def test_get_emtpy_resource_links
    resource = {:name => "bla"}

    ret = RHQ_util.get_resource_links(resource)

    assert ret.empty? , "ret was unexpectedly #{ret.to_s}"
  end
end