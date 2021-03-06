import { myclock } from "./myclock.js";
import { console_output } from "./console_output.js";

class counters {
    constructor(){
        this.tests = 0;
        this.failed = 0;
        this.risky = 0;
        this.ok = 0;
        this.asserts = 0;
    }
    inc_tests(){
        this.tests++;
    }
    inc_failed(){
        this.failed++;
    }
    inc_risky(){
        this.risky++;
    }
    inc_ok(){
        this.ok++;
    }
    inc_asserts( number ){
        this.asserts += number ;
    }
    get_totals_text() {
        var failed = this.failed;
        var risky = this.risky;
        var ok = this.ok;
        var tests_count = this.tests;

        return "Tests Total: "+tests_count +" Asserts: "+ this.asserts +"  Passed: "+ok+"  Failed: "+failed+"  Risky: "+risky;
    }
    is_ok() {
        return this.failed == 0 && this.risky == 0;
    }

    is_failed() {
        return this.failed > 0;
    }
    is_risky() {
        return this.risky > 0;
    }

}
export class console_report {
    constructor( output ) {
        if( output  === undefined ){
            output = new console_output();
        }
        this.output = output;
        
        this.timers = [];
        
        
        this.counters = new counters();
        
        

        this.error_list = [];
                        
        this.main_timer = new myclock();
        this.main_timer.start();

        
    }
    
    assertsRun( number ){
        this.counters.inc_asserts( number );
    }
    add_timer( classname, method, timer ){
        this.timers.push( [ classname, method, timer ] );
    }
    
    stop_main_timer( timer ){
        this.main_timer.stop();
    }

    header(){
        console.log( "JAESTF - by @RudyMartin " );
        console.log( "ES6 JavaScript Testing Framework vaguely inspired on PHPUnit" );
        console.log( "Licence: WTFPL - https://en.wikipedia.org/wiki/WTFPL");
        console.log( "");
    }

    ok(){
        this.counters.inc_ok();
    }
    failed(){
        this.counters.inc_failed();
        this.output.fail( "E" ); // E "dot"
    }

    total(){
        this.counters.inc_tests();
    }

    risky(){
        this.counters.inc_risky();
        // R "dot"
        this.output.risky( "R" );
    }

    add_error( element ){
        this.error_list.push( element );
    }

    dot(){
        this.output.normal( "." );
    }
    
    list_errors(){
        var self = this;
        this.error_list.forEach( function( mensaje ) {
            if( mensaje instanceof Error   ){
                self.output.normal( mensaje.stack );
                self.output.line_break();
                self.output.line_break();
            } else {
                self.output.normal( mensaje );
                self.output.line_break();
            }

        });
        
    }
    
    print_total_asserts(){
        // "Tests Total: "+tests_count +" Asserts: "+ this.counters.asserts +"  Passed: "+ok+"  Failed: "+failed+"  Risky: "+risky;
        var text = this.counters.get_totals_text(); 
        
        this.output.line_break();
        
        if( this.counters.is_ok() ){
            this.output.set_ok_color( );
        }
        if( this.counters.is_risky() ){
            this.output.set_risky_color();
        } 
        if( this.counters.is_failed() ){
            this.output.set_fail_color();
        } 
        this.output.normal( text );

        this.output.line_break();
    }
    
    print_time_spent(){
        var average = this.main_timer.diff() / this.counters.tests;
        var max = 0;
        var which_class = "";
        var which_method = "";
        this.timers.forEach( function( item ){
            var timer = item[2];
            var spent = timer.diff();
            if( spent > max ){
                which_class = item[0];
                which_method = item[1];
                max = spent;
            }
        });
        this.output.line_break();
        this.output.text_normal( "Total = "+this.main_timer.diff()+" msecs / Test Average = "+average.toFixed(3)+" msecs" );
        if( max > average ){
            this.output.text_normal( "Slowest test: "+which_class+"."+which_method+" = "+max+" msecs"  );	    
        }
    }
    
    end(){
        this.stop_main_timer( );
                
        var failed = this.counters.failed;
        var risky = this.counters.risky;

        this.output.normal( " ("+this.counters.ok+"/"+this.counters.tests+")"  );
        this.output.line_break();
        this.output.line_break();
        if( failed > 0 || risky > 0 ){
            this.list_errors();
        }

        this.print_total_asserts();
        this.print_time_spent();
        
    }
    
}
